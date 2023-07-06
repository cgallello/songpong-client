import React, { useState } from 'react';
import TrackList from '../components/tracklist';
import WebPlayback from '../components/webplayback'

export default function Search() {

	const [inputValue, setInputValue] = useState('');
	const [searchResultsData, setSearchResultsData] = useState([]);
	const [playlistId, setPlaylistId] = useState('');
	const [playlistCreated, setPlaylistCreated] = useState(false);
	const [currentSong, setCurrentSongState] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);

	if(!playlistCreated){
		// createPlaylistAPI();
	}
	
	async function createPlaylistAPI() {
		setPlaylistCreated(true);
		const endpointURL = 'https://api.spotify.com/v1/users/' + localStorage.getItem('spotifyId') + '/playlists';
		const response = fetch(endpointURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('access_token')
			},
			body: JSON.stringify({
				'name': 'Song Pong Playlist',
				'public': true
			})
		})
			.then(response => {
				if (!response.ok) {
					if(response.status == 401){ window.location = '/'; }
					throw new Error('HTTP status ' + response.status + response.message);
				}
				return response.json();
			})
			.then(data => {
				localStorage.setItem('spotifyPlaylistId', data.id);
				setPlaylistId(data.id);
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}

	async function searchAPI(e){
		currentAudio && currentAudio.pause();
		let searchQuery = inputValue.replace(/\s/g, '+');
		const endpointURL = 'https://api.spotify.com/v1/search?q=' + searchQuery + '&type=track' + '&limit=10';
		let tmpResultsArray = [];

		const response = await fetch(endpointURL, {
			method: 'GET',
			headers: {
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
				data.tracks.items.forEach((item, index) => {
					tmpResultsArray.push({
						name: item.name,
						duration: item.duration_ms,
						albumName: item.album.name,
						albumArtwork: item.album.images[2].url,
						artistName: item.artists[0].name,
						uri: item.uri,
						preview_url: item.preview_url
					});
					setSearchResultsData(tmpResultsArray);
				});
			})
			.catch(error => {
				console.error('Error:', error);
			});		
	}
	
	async function setSongAPI(track){
		const endpointURL = 'https://api.spotify.com/v1/me/player/play?device_id=' + localStorage.getItem('device_id');
		const response = await fetch(endpointURL, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access_token')
			},
			body: JSON.stringify({
				uris:[track.uri]
			})
		});
	}

	const handleChange = (event) => {
    	setInputValue(event.target.value);
  	}	
	
	const setCurrentSong = (track) => {
		let spotifyProduct = localStorage.getItem('spotifyProduct');
		currentAudio && currentAudio.pause();
		setCurrentSongState(track);
		if(spotifyProduct == "free"){
			if(track.preview_url){
				let audio = new Audio(track.preview_url)
				audio.play();
				setCurrentAudio(audio);
			}
		} else if (spotifyProduct == "premium"){
			setSongAPI(track);
		}
	};

	return (
		<main>
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
				<div style={{overflowY: 'scroll', height:'calc(100% - 40px)'}}>
					<TrackList tracks={searchResultsData} playlistId={playlistId} currentSong={currentSong} setCurrentSong={setCurrentSong} />
				</div>
			</div>
			<WebPlayback {...{ access_token: localStorage.getItem('access_token'), currentSong }} />
		</main>
	);
}