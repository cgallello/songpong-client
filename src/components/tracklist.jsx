import React from 'react';
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
				{/* <tr>
					<th></th>
					<th>Duration</th>
					<th>Album</th>
				</tr> */}
			</thead>
			<tbody>
				{track}
			</tbody>
		</table>
	);
}

export default TrackList;