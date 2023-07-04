import React from 'react';

function SearchResult({index, track, playlistId, currentSong, setCurrentSong}) {

	const isCurrentSong = track.preview_url && currentSong === track.preview_url;

	function playSong(preview_url){
		setCurrentSong(preview_url);
	}

	async function addToPlaylist(trackUri, playlistId) {
		const endpointURL = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks';
		const response = fetch(endpointURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('access_token')
			},
			body: JSON.stringify({
				'uris': [trackUri]
			})
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('HTTP status ' + response.status + response.message);
				}
				return response.json();
			})
			.then(data => {
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}

	const playable = (preview_url) => {
		if(preview_url){
			return(playable);
		}
	}

	return (
		<tr className="searchResultRow" onClick={() => playSong(track.preview_url)}>
			<td className={"trackTitleContainer" + (track.preview_url ? " playable" : "")}>
				<div><img className="" src={track.albumArtwork} /></div>
				<div>
					<p className="trackName">{isCurrentSong ? '🎵' : '' }{track.name}</p>
					<p>{track.artistName}</p>
				</div>
			</td>
			<td><p>{track.duration}</p></td>
			<td><p>{track.albumName}</p></td>
			<td>
				<button onClick={() => addToPlaylist(track.uri, playlistId)}>Add</button>
			</td>
		</tr>
	);
}

export default SearchResult;