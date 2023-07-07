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