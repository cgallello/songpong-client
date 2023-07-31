import React, { useEffect, useState, useRef } from 'react';
import PublicPlaylist from './publicplaylist.jsx';
import { spotifyAxios, internalAxios } from '../components/HTTPintercept';
import { useLocation } from 'react-router-dom';

function PlaylistGallery() {
    const API_URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL_LOCAL;
	const [publicPlaylists, setPublicPlaylists] = useState([]);
	const isFirstRender = useRef(true);
	const location = useLocation();

    useEffect(() => {
        getTopPlaylists();
    }, []);

    useEffect(() => {
		getTopPlaylists();
	}, [location.pathname]);

    async function getTopPlaylists() {
        try {
            const internalResponse = await internalAxios.get(`${API_URL}/topplaylists`, {
                params: {
                    spotify_id: localStorage.getItem('spotifyId')
                }
            });
            const playlists = internalResponse.data.map((playlist, index) => ({
                key: index,
                index: index,
                playlistId: playlist.spotify_playlist_id,
                playlistName: playlist.playlistname,
                upvotes: playlist.upvotes,
                upvoted: playlist.upvoted,
                avatarUrl: playlist.spotify_avatar_url
            }));
            setPublicPlaylists(playlists);
        } catch (error) { }
    }

    return (
        <div class="playlistGallery">
            <h2>Top playlists this week</h2>
            <table className="publicPlaylistsTable">
                <tbody>
                    {publicPlaylists.map(playlist => 
                        <PublicPlaylist 
                            key={playlist.key} 
                            index={playlist.index} 
                            playlistId={playlist.playlistId} 
                            playlistName={playlist.playlistName} 
                            upvotes={playlist.upvotes}
                            upvoted={playlist.upvoted}
                            avatarUrl={playlist.avatarUrl}
                        />
                    )}
                </tbody>
            </table>
        </div>
    );

    
}

export default PlaylistGallery;