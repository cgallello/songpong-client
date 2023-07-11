import React, { useState, useEffect } from 'react';
import { spotifyAxios, internalAxios } from '../components/HTTPintercept';

export default function Home() {
    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
		getPlaylistsAPI();
	}, []);

    async function getPlaylistsAPI() {
		const endpointURL = 'https://api.spotify.com/v1/users/' + localStorage.getItem('spotifyId') + '/playlists';
		try {
			const response = await spotifyAxios.get(endpointURL);
			setPlaylists(response.data);
		} catch (error) { }
	}

	async function createPlaylistAPI() {
		const endpointURL = 'https://api.spotify.com/v1/users/' + localStorage.getItem('spotifyId') + '/playlists';
		try {
			const spotifyResponse = await spotifyAxios.post(endpointURL, {
				'name': 'Song Pong Playlist',
				'public': true
			});
			if (spotifyResponse.status >= 200 && spotifyResponse.status < 300) {
				localStorage.setItem('spotifyPlaylistId', spotifyResponse.data.id);
				localStorage.setItem("playlistId", spotifyResponse.data.id);
				console.log(spotifyResponse.status);
				const internalResponse = await internalAxios.post('http://localhost:8000/api/playlists', {
					'spotify_playlist_id': spotifyResponse.data.id,
					'owner': localStorage.getItem('spotifyId'),
					'members': [],
					'tracks': []
				});
				console.log(spotifyResponse.status);
				window.location.href = '/playlist/' + spotifyResponse.data.id;
			} else {
				console.log('Error creating playlist');
			}
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