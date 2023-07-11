import React, { useState, useEffect } from 'react';
import TrackList from '../components/tracklist';
import WebPlayback from '../components/webplayback';
import axiosInstance from '../components/HTTPintercept';
import BackButton from '../components/backbutton';

export default function Search() {

	const [inputValue, setInputValue] = useState('');
	const [searchResultsData, setSearchResultsData] = useState(null);
	const [playlistId, setPlaylistId] = useState('');
	const [currentSong, setCurrentSongState] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);
    const [playlists, setPlaylists] = useState(null);

	useEffect(() => {
		setPlaylistId(localStorage.getItem('playlistId'));
		getPlaylistsAPI();
	}, []);

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
			setSearchResultsData(response.data.tracks.items);
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
		event.preventDefault();
		setInputValue(event.target.value);
	}

	const submitSearch = (event) => {
		event.preventDefault();
		searchAPI();
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

    async function getPlaylistsAPI() {
		const endpointURL = 'https://api.spotify.com/v1/users/' + localStorage.getItem('spotifyId') + '/playlists';
		try {
			const response = await axiosInstance.get(endpointURL);
			response.data.items = response.data.items.filter(x => x.id !== playlistId);
			setPlaylists(response.data);
		} catch (error) { }
	}


	// Probably can delete
	function playlistAddMode(){
		setPlaylistId(localStorage.setItem('playlistId'. playlistId));
	}

	return (
		<main>
			<div className="mainPadding">
				<div className="mainWrapper">
					<BackButton></BackButton>
					<div className="editWrapper">
						<form onSubmit={submitSearch} className="searchBar">
							<input
								type="text"
								placeholder="search"
								autoFocus
								id="searchQuery"
								value={inputValue}
								onChange={handleChange}
							/>
							<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="13.8795" cy="9.18836" r="7.7174" stroke="white"/>
	<line x1="7.99418" y1="14.856" x2="1.35002" y2="21.5002" stroke="white"/>
	</svg>
	<input type="submit" className="search" value=""></input>
						</form>
						{searchResultsData && 
							<div style={{ overflowY: 'scroll', height: 'calc(100% - 40px)' }}>
								<TrackList tracks={searchResultsData} playlistId={playlistId} currentSong={currentSong} setCurrentSong={setCurrentSong} />
							</div>
						}
						{!searchResultsData &&
							<div>
								{playlists && playlists.items ? (playlists.items.map((playlist, i) =>
									<div key={i}><p><a href={"/playlist/" + playlist.id + "?p=" + playlistId} onClick={playlistAddMode}>{playlist.name} &gt;</a></p></div>)
								) : (<p>Loading...</p>)}
							</div>
						}
					</div>
				</div>
			</div>
			<WebPlayback {...{ access_token: localStorage.getItem('access_token'), currentSong, setCurrentSong }} />
		</main>
	);
}