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
				<th style={{width:"17px"}}></th>
				<th style={{minWidth:"140px"}}></th>
				<th style={{width:"55px"}}></th>
				<th style={{width:"140px"}}></th>
			</thead>
			<tbody>
				{track}
			</tbody>
		</table>
	);
}

export default TrackList;