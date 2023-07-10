import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import WebPlayback from '../components/webplayback';
import TrackList from '../components/tracklist';
import axiosInstance from '../components/HTTPintercept';
import BackButton from '../components/backbutton';

export default function Playlist() {

	const { playlistUrlId } = useParams();
	const [playlistData, setPlaylistData] = useState(null);
	const [playlistTrackData, setPlaylistTrackData] = useState([]);
	const [playlistId, setPlaylistId] = useState('');
	const [currentSong, setCurrentSongState] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);
	const location = useLocation();

	const urlParams = new URLSearchParams(window.location.search);
	let code = urlParams.get('p');
	
	useEffect(() => {
		getPlaylistAPI();
	}, [location.pathname]);

	async function getPlaylistAPI() {
		const endpointURL = 'https://api.spotify.com/v1/playlists/' + playlistUrlId + playlistId + '?&timestamp=' + new Date().getTime();
		let tmpResultsArray = [];
		try {
			const response = await axiosInstance.get(endpointURL);
			document.title = response.data.name + ' – Song Pong';
			localStorage.setItem("playlistId", response.data.id);
			setPlaylistData({
				id: response.data.id,
				image: response.data.images[1].url,
				name: response.data.name,
				uri: response.data.uri
			});
			response.data.tracks.items.forEach((item, index) => {
				tmpResultsArray.push(item.track);
				setPlaylistTrackData(tmpResultsArray);
			});
		} catch (error) { }
	}

	async function setSongAPI(track) {
		const endpointURL = 'https://api.spotify.com/v1/me/player/play?device_id=' + localStorage.getItem('device_id');
		try {
			const response = await axiosInstance.put(endpointURL, {
				'context_uri': playlistData.uri,
				'offset': { 'uri': track.uri }
			});
		} catch (error) { }
	}

	const setCurrentSong = (track) => {
		setCurrentSongState(track);
		currentAudio && currentAudio.pause();
		let spotifyProduct = localStorage.getItem('spotifyProduct');
		if (spotifyProduct == "free") {
			if (track.track.preview_url) {
				let audio = new Audio(track.track.preview_url)
				audio.play();
				setCurrentAudio(audio);
			}
		} else if (spotifyProduct == "premium") {
			setSongAPI(track);
		}
	};

	return (
		<main>
			<div className="mainWrapper">
				<BackButton />
				{ playlistData &&
					<div className="editWrapper">
						<h1><img src={playlistData.image} alt={playlistData.name} className="albumArtwork" />{playlistData.name}</h1>
						<div><a href="/search">Add to playlist</a></div>
						<div style={{ overflowY: 'scroll', height: 'calc(100% - 40px)' }}>
							<TrackList tracks={playlistTrackData} playlistId={code} currentSong={currentSong} setCurrentSong={setCurrentSong} />
						</div>
					</div>
				}
				{ !playlistData &&
					<p>Loading...</p>
				}
			</div>
			<WebPlayback {...{ access_token: localStorage.getItem('access_token'), currentSong, setCurrentSong }} />
		</main>
	);
}