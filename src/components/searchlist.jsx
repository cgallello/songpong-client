import React from 'react';
import SearchResult from './searchresult.jsx';

function SearchList({ searchResults, playlistId }) {
	const searchResult = searchResults.map(track => <SearchResult key={track.uri} track={track} playlistId={playlistId} />);
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