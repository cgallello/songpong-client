import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/HTTPintercept';

export default function Home() {
    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
		getPlaylistsAPI();
	}, []);

    async function getPlaylistsAPI() {
		const endpointURL = 'https://api.spotify.com/v1/users/' + localStorage.getItem('spotifyId') + '/playlists';
		try {
			const response = await axiosInstance.get(endpointURL);
			setPlaylists(response.data);
		} catch (error) { }
	}

	async function createPlaylistAPI() {
		const endpointURL = 'https://api.spotify.com/v1/users/' + localStorage.getItem('spotifyId') + '/playlists';
		try {
			const response = await axiosInstance.post(endpointURL, {
				'name': 'Song Pong Playlist',
				'public': true
			});
			localStorage.setItem('spotifyPlaylistId', response.data.id);
			localStorage.setItem("playlistId", response.data.id);
			window.location.href = '/playlist/' + response.data.id;
			console.log(response.data.id);
		} catch (error) { }
	}

	return (
		<main>
			<div className="mainPadding">
				<div className="mainWrapper">
					<button onClick={createPlaylistAPI}>Create playlist</button>
					<h2>Playlists</h2>
					<div>
						{playlists && playlists.items ? (playlists.items.map((playlist, i) =>
							<div key={i}><p><a href={"/playlist/" + playlist.id}>{playlist.name} &gt;</a></p></div>)
						) : (<p>Loading...</p>)}
					</div>
				</div>
			</div>
		</main>
	);
}