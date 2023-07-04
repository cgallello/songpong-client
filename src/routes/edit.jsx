import { clientId, redirectUri } from '../config';
import React, { useState } from 'react';
import SearchList from '../components/searchlist';

export default function Edit() {

	const [inputValue, setInputValue] = useState('');
	const [searchResultsData, setSearchResultsData] = useState([]);
	const [playlistId, setPlaylistId] = useState('');
	const [playlistCreated, setPlaylistCreated] = useState(false);
	
	if(!playlistCreated){
		// localStorage.getItem('spotifyPlaylistId') == null && 
		createPlaylist();
	}
	
	async function createPlaylist() {
		setPlaylistCreated(true);
		console.log("creating playlist");
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

	function msToHMS(ms) {
		// 1- Convert to seconds:
	    let seconds = ms / 1000;
	    // 2- Extract hours:
	    const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
	    seconds = seconds % 3600; // seconds remaining after extracting hours
	    // 3- Extract minutes:
	    const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
	    // 4- Keep only seconds not extracted to minutes:
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
	
	return (
		<main>
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
		        <SearchList searchResults={searchResultsData} playlistId={playlistId} />
		  	</div>
		</main>
	);
}