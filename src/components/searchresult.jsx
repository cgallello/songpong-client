import React from 'react';
import AudioPlayer from './audioplayer.jsx';

function SearchResult({track, playlistId}) {

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

	return (
		<tr className="searchResultRow">
			<td className="trackTitleContainer">
				<div><img className="" src={track.albumArtwork} /></div>
				<div>
					<p className="trackName">{track.name}</p>
					<p>{track.artistName}</p>
				</div>
			</td>
			<td><p>{track.duration}</p></td>
			<td><p>{track.albumName}</p></td>
			<td>
				<button onClick={() => addToPlaylist(track.uri, playlistId)}>Add</button>
			</td>
			
			{/* <AudioPlayer url={track.url} /> */}
		</tr>
	);
}

export default SearchResult;