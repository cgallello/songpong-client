import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import WebPlayback from '../components/webplayback';
import TrackList from '../components/tracklist';
import axiosInstance from '../components/HTTPintercept';

export default function Playlist() {

	const { playlistUrlId } = useParams();
	const [playlistData, setPlaylistData] = useState();
	const [playlistTrackData, setPlaylistTrackData] = useState([]);
	const [playlistId, setPlaylistId] = useState('');
	const [playlistCreated, setPlaylistCreated] = useState(false);
	const [currentSong, setCurrentSongState] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);

	const location = useLocation();
	
	useEffect(() => {
		getPlaylistAPI();
	}, [location]);

	async function getPlaylistAPI() {
		const endpointURL = 'https://api.spotify.com/v1/playlists/' + playlistUrlId;
		let tmpResultsArray = [];
		try {
			const response = await axiosInstance.get(endpointURL);
			document.title = response.data.name + ' – Song Pong';
			localStorage.setItem("playlistId", response.data.id);
			setPlaylistData({
				id: response.data.id,
				image: response.data.images[0].url,
				name: response.data.name,
				uri: response.data.uri
			});
			response.data.tracks.items.forEach((item, index) => {
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
			if (track.preview_url) {
				let audio = new Audio(track.preview_url)
				audio.play();
				setCurrentAudio(audio);
			}
		} else if (spotifyProduct == "premium") {
			setSongAPI(track);
		}
	};

	return (
		<main>
			<div className="editWrapper">
				<div><a href="/search">Add to playlist</a></div>
				<div style={{ overflowY: 'scroll', height: 'calc(100% - 40px)' }}>
					<TrackList tracks={playlistTrackData} playlistId={null} currentSong={currentSong} setCurrentSong={setCurrentSong} />
				</div>
			</div>
			<WebPlayback {...{ access_token: localStorage.getItem('access_token'), currentSong }} />
		</main>
	);
}