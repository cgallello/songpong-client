import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WebPlayback from '../components/webplayback';
import TrackList from '../components/tracklist';

export default function Playlist() {

	const { playlistUrlId } = useParams();
	const [playlistData, setPlaylistData] = useState();
	const [playlistTrackData, setPlaylistTrackData] = useState([]);
	const [playlistId, setPlaylistId] = useState('');
	const [playlistCreated, setPlaylistCreated] = useState(false);
	const [currentSong, setCurrentSongState] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);

	useEffect(() => {
		getPlaylist();
	}, []);

	async function getPlaylist() {
		const endpointURL = 'https://api.spotify.com/v1/playlists/' + playlistUrlId;
		let tmpResultsArray = [];
		const response = fetch(endpointURL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('access_token')
			}
		})
			.then(response => {
				if (!response.ok) {
					if(response.status == 401){ window.location = '/'; }
					throw new Error('HTTP status ' + response.status + response.message);
				}
				return response.json();
			})
			.then(data => {
                document.title = data.name + ' – Song Pong';
				setPlaylistData({
					id: data.id,
					image: data.images[0].url,
					name: data.name,
					uri: data.uri
				});
				data.tracks.items.forEach((item, index) => {
					tmpResultsArray.push({
						name: item.track.name,
						duration: item.track.duration_ms,
						albumName: item.track.album.name,
						albumArtwork: item.track.album.images[2].url,
						artistName: item.track.artists[0].name,
						uri: item.track.uri,
						preview_url: item.track.preview_url
					});
					setPlaylistTrackData(tmpResultsArray);
				});
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}
	
	async function setSong(track){
		const endpointURL = 'https://api.spotify.com/v1/me/player/play?device_id=' + localStorage.getItem('device_id');
		const response = await fetch(endpointURL, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access_token')
			},
			body: JSON.stringify({
				uris:[track.uri]
			}),
			body: JSON.stringify({
				'context_uri': playlistData.uri,
				'offset':{
					'uri':track.uri
				}
			})
		});	

	}
	
	const setCurrentSong = (track) => {
		setCurrentSongState(track);
		currentAudio && currentAudio.pause();
		let spotifyProduct = localStorage.getItem('spotifyProduct');
		if(spotifyProduct == "free"){
			if(track.preview_url){
				let audio = new Audio(track.preview_url)
				audio.play();
				setCurrentAudio(audio);
			}
		} else if (spotifyProduct == "premium"){
			setSong(track);
		}
	};

	return (
		<main>
			<div className="editWrapper">
				<div><a href="/search">Add to playlist</a></div>
				<div style={{overflowY: 'scroll', height:'calc(100% - 40px)'}}>
					<TrackList tracks={playlistTrackData} playlistId={playlistId} currentSong={currentSong} setCurrentSong={setCurrentSong} />
				</div>
			</div>
			<WebPlayback {...{ access_token: localStorage.getItem('access_token'), currentSong }} />
		</main>
	);
}