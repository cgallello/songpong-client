import React, { useState, useEffect } from 'react';
import { internalAxios } from '../components/HTTPintercept';

function UpvoteButton({ playlistId, upvotes, upvoted }) {
    const API_URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL_LOCAL;
    const [localUpvoted, setLocalUpvoted] = useState(false);
    const [localUpvotes, setLocalUpvotes] = useState(0);

    useEffect(() => {
        upvoted ? setLocalUpvoted(true) : setLocalUpvoted(false);
        setLocalUpvotes(upvotes);
    }, []);

    async function upvotePlaylist() {
		if(!upvoted){
            setLocalUpvotes(localUpvotes + 1);
			setLocalUpvoted(true);
			const internalResponse = await internalAxios.post(`${API_URL}/playlists/` + playlistId + '/upvote', {
				spotify_id: localStorage.getItem('spotifyId')
			});
			if (internalResponse.status >= 200 && internalResponse.status < 300) {
			} else {
				setLocalUpvoted(false);
				console.log('Error upvoting playlist');
			}
		}
	}

	return (
        <button onClick={upvotePlaylist} className={localUpvoted ? "upvoteButton upvoted" : "upvoteButton"}>
            <svg className="upvoteIcon" width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.2 9.4L7.7 2.06667C8.1 1.53333 8.9 1.53333 9.3 2.06667L14.8 9.4C15.2944 10.0592 14.824 11 14 11H12C11.4477 11 11 11.4477 11 12V20C11 20.5523 10.5523 21 10 21H7C6.44772 21 6 20.5523 6 20V12C6 11.4477 5.55228 11 5 11H3C2.17595 11 1.70557 10.0592 2.2 9.4Z" stroke="white" strokeWidth="1.5" fill={localUpvoted ? "white" : "transparent"} />
            </svg>
            {localUpvotes}
        </button>
	);
}

export default UpvoteButton;