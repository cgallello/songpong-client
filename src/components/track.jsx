import React, { useState, useEffect } from 'react';
import { spotifyAxios, internalAxios }  from '../components/HTTPintercept';

function Track({index, track, playlistId, currentSong, setCurrentSong}) {

	const [added, setAdded] = useState(false);
	const [isCurrentSong, setIsCurrentSong] = useState(false);

	useEffect(() => {
		if(track !== null && currentSong !== null){
			setIsCurrentSong((track.preview_url && currentSong === track.preview_url) || (track.id == currentSong.id));
		}
	}, [currentSong]);

	async function addToPlaylistAPI(track, playlistId) {
		const endpointURL = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks';
		try {
			const spotifyResponse = await spotifyAxios.post(endpointURL,{
				'uris': [track.uri]
			});
			if (spotifyResponse.status < 200 || spotifyResponse.status >= 300) {
				console.log('Error adding track to playlist');
			}
		} catch (error) {}
	}

	function addToPlaylist(e){
		e.stopPropagation();
		if(!added){
			setAdded(true);
			addToPlaylistAPI(track, playlistId);
		}
	}

	function msToHMS(ms) {
	    let seconds = ms / 1000;
	    const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
	    seconds = seconds % 3600; // seconds remaining after extracting hours
	    const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
	    seconds = seconds % 60;
		if(hours>0){
			return hours+":" + (minutes < 10 ? "0" : "") + minutes+":"+ (Math.floor(seconds) < 10 ? "0" : "") + Math.floor(seconds);
		} else {
			return minutes+":"+(Math.floor(seconds) < 10 ? "0" : "") + Math.floor(seconds);
		}
	}

	return (
		<tr className={"trackRow" + (track.preview_url ? " playable" : "")} onClick={() => setCurrentSong(track, "trackClick")}>
			<td className="trackTitleContainer">
				<div className="albumArtworkContainer"><img src={track.album.images[2].url} className={isCurrentSong ? 'trackArtwork playing' : 'trackArtwork' } /><div className="playText">▶</div></div>
				<div>
					<p className="trackName">{track.name}</p>
					<p className="artistName">{track.artists[0].name}</p>
				</div>
			</td>
			<td className="durationColumn"><p>{msToHMS(track.duration_ms)}</p></td>
			<td className="albumColumn"><p>{track.album.name}</p></td>
			<td>
				{track.spotify_avatar_url &&
				<img src={track.spotify_avatar_url} className={"avatarUrl"} />
				}
			</td>
			{playlistId !== null ? (<td>
				<button onClick={addToPlaylist} disabled={added}>{!added ? 'Add' : 'Added'}</button>
			</td>):(null)}
		</tr>
	);
}

export default Track;