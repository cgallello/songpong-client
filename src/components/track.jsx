import React from 'react';

function Track({index, track, playlistId, currentSong, setCurrentSong}) {

	const isCurrentSong = track.preview_url && currentSong === track.preview_url;

	async function addToPlaylistAPI(trackUri, playlistId) {
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

	return (
		<tr className="trackRow">
			<td className={"trackTitleContainer" + (track.preview_url ? " playable" : "")}
				onClick={() => setCurrentSong(track)}>
				<div><img className="" src={track.albumArtwork} /></div>
				<div>
					<p className="trackName">{isCurrentSong ? '🎵' : '' }{track.name}</p>
					<p>{track.artistName}</p>
				</div>
			</td>
			<td><p>{msToHMS(track.duration)}</p></td>
			<td><p>{track.albumName}</p></td>
			<td>
				<button onClick={() => addToPlaylistAPI(track.uri, playlistId)}>Add</button>
			</td>
		</tr>
	);
}

export default Track;