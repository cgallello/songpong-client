import React, { useState } from 'react';
import SearchList from '../components/searchlist';
import WebPlayback from '../components/webplayback'

export default function Edit() {

	const [inputValue, setInputValue] = useState('');
	const [searchResultsData, setSearchResultsData] = useState([]);
	const [playlistId, setPlaylistId] = useState('');
	const [playlistCreated, setPlaylistCreated] = useState(false);
	const [currentSong, setCurrentSongState] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);

	if(!playlistCreated){
		createPlaylist();
	}
	
	async function createPlaylist() {
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

	async function handleSearch(e){
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
					throw new Error('HTTP status ' + response.status + response.message);
				}
				return response.json();
			})
			.then(data => {
				data.tracks.items.forEach((item, index) => {
					tmpResultsArray.push({
						name: item.name,
						duration: msToHMS(item.duration_ms),
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
	
	async function setSong(track){
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

	function msToHMS(ms) {
	    let seconds = ms / 1000;
	    const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
	    seconds = seconds % 3600; // seconds remaining after extracting hours
	    const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
	    seconds = seconds % 60;
		if(hours>0){
			return hours+":"+minutes+":"+Math.round(seconds);
		} else {
			return minutes+":"+Math.round(seconds);
		}
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
			setSong(track);
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
					<input type="button" className="search" value="Search" onClick={handleSearch}></input>
				</form>
				<div style={{overflowY: 'scroll', height:'calc(100% - 40px)'}}>
					<SearchList searchResults={searchResultsData} playlistId={playlistId} currentSong={currentSong} setCurrentSong={setCurrentSong} />
				</div>
			</div>
			<WebPlayback {...{ access_token: localStorage.getItem('access_token'), currentSong }} />
		</main>
	);
}