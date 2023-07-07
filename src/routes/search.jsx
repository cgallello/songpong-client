import React, { useState, useEffect } from 'react';
import TrackList from '../components/tracklist';
import WebPlayback from '../components/webplayback';
import axiosInstance from '../components/HTTPintercept';
import BackButton from '../components/backbutton';

export default function Search() {

	const [inputValue, setInputValue] = useState('');
	const [searchResultsData, setSearchResultsData] = useState([]);
	const [playlistId, setPlaylistId] = useState('');
	const [playlistCreated, setPlaylistCreated] = useState(false);
	const [currentSong, setCurrentSongState] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);

	if (!playlistCreated) {
		// createPlaylistAPI();
	}

	useEffect(() => {
		setPlaylistId(localStorage.getItem('playlistId'));
	}, []);

	async function createPlaylistAPI() {
		setPlaylistCreated(true);
		const endpointURL = 'https://api.spotify.com/v1/users/' + localStorage.getItem('spotifyId') + '/playlists';
		try {
			const response = await axiosInstance.put(endpointURL, {
				'name': 'Song Pong Playlist',
				'public': true
			});
			localStorage.setItem('spotifyPlaylistId', response.data.id);
			setPlaylistId(response.data.id);
			localStorage.setItem("playlistId", response.data.id);
		} catch (error) { }
	}

	async function searchAPI(e) {
		currentAudio && currentAudio.pause();
		let searchQuery = inputValue.replace(/\s/g, '+');
		const endpointURL =
			'https://api.spotify.com/v1/search?q=' + searchQuery + '&type=track' + '&limit=10';
		let tmpResultsArray = [];
		try {
			const response = await axiosInstance.get(endpointURL, {
				name: 'Song Pong Playlist',
				public: true,
			});
			response.data.tracks.items.forEach((item, index) => {
				tmpResultsArray.push({
					name: item.name,
					duration: item.duration_ms,
					albumName: item.album.name,
					albumArtwork: item.album.images[2].url,
					artistName: item.artists[0].name,
					uri: item.uri,
					preview_url: item.preview_url,
				});
			});
			setSearchResultsData(tmpResultsArray);
		} catch (error) { }
	}


	async function setSongAPI(track) {
		const endpointURL = 'https://api.spotify.com/v1/me/player/play?device_id=' + localStorage.getItem('device_id');
		try {
			const response = await axiosInstance.put(endpointURL, {
				uris: [track.uri]
			});
		} catch (error) { }
	}

	const handleChange = (event) => {
		setInputValue(event.target.value);
	}

	const setCurrentSong = (track) => {
		let spotifyProduct = localStorage.getItem('spotifyProduct');
		currentAudio && currentAudio.pause();
		setCurrentSongState(track);
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
			<BackButton></BackButton>
			<div className="editWrapper">
				<form>
					<input
						type="text"
						placeholder="search"
						autoFocus
						id="searchQuery"
						value={inputValue}
						onChange={handleChange}
					/>
					<input type="button" className="search" value="Search" onClick={searchAPI}></input>
				</form>
				<div style={{ overflowY: 'scroll', height: 'calc(100% - 40px)' }}>
					<TrackList tracks={searchResultsData} playlistId={playlistId} currentSong={currentSong} setCurrentSong={setCurrentSong} />
				</div>
			</div>
			<WebPlayback {...{ access_token: localStorage.getItem('access_token'), currentSong }} />
		</main>
	);
}