import React, { useEffect } from 'react';
import Track from './track.jsx';

function TrackList({ tracks, playlistId, currentSong, setCurrentSong }) {

	const track = tracks.map((track, index) => <Track 
		key={index} 
		index={index} 
		track={track} 
		playlistId={playlistId} 
		currentSong={currentSong}
		setCurrentSong={setCurrentSong} 
		/>);

	return (
		<table className="trackList">
			<thead>
			</thead>
			<tbody>
				{track}
			</tbody>
		</table>
	);
}

export default TrackList;