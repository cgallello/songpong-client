import React, { useState, useEffect } from 'react';

export default function Home() {
    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
		getPlaylistsAPI();
	}, []);

    async function getPlaylistsAPI() {
		const endpointURL = 'https://api.spotify.com/v1/users/' + localStorage.getItem('spotifyId') + '/playlists';
		const response = fetch(endpointURL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('access_token')
			}
		})
			.then(response => {
				if (!response.ok) {
					if(response.status == 401){ window.location = '/'; }
					throw new Error('HTTP status ' + response.status + response.message);
				}
				return response.json();
			})
			.then(data => {
				setPlaylists(data);
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}



	return (
		<main>
            <p><a href="/search">Search 🔎</a></p>
            <div><a href="/create">Create playlist</a></div>
			<h2>Playlists</h2>
            <div>
                {playlists && playlists.items ? (playlists.items.map((playlist, i) =>
                    <p><a href={"/playlist/" + playlist.id}>{playlist.name} &gt;</a></p>)
                ) : (<p>Loading...</p>)}
            </div>
		</main>
	);
}