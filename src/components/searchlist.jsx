import React from 'react';
import SearchResult from './searchresult.jsx';

function SearchList({ searchResults, playlistId, currentSong, setCurrentSong }) {

	const searchResult = searchResults.map((track, index) => <SearchResult 
		key={index} 
		index={index} 
		track={track} 
		playlistId={playlistId} 
		currentSong={currentSong}
		setCurrentSong={setCurrentSong} 
		/>);

	return (
		<table className="searchResult">
			<thead>
				<tr>
					<th></th>
					<th>Duration</th>
					<th>Album</th>
				</tr>
			</thead>
			<tbody>
				{searchResult}
			</tbody>
		</table>
	);
}

export default SearchList;