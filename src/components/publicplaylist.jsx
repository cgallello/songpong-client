import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { internalAxios, spotifyAxios } from '../components/HTTPintercept';
import UpvoteButton from './upvotebutton.jsx';

function PublicPlaylist({ index, playlistId, playlistName, upvotes, upvoted, avatarUrl }) {

    function truncatedPlaylistName(playlistName){
		var trimmedString = playlistName.replace('– PlaylistGen.com','').substr(0, 100); 
		if(playlistName.length > 100){
			return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + "...";
		} else {
			return trimmedString;
		}
	}

	return (
		<tr>
            <td className="playlistUpvotes">
                <UpvoteButton
                    playlistId={playlistId} 
                    upvotes={upvotes}
                    upvoted={upvoted}
                 />
            </td>
            <td className="playlistCreatorImage">
                <img src={avatarUrl} alt="playlistCreatorImage" width="30" class="creatorImage" />
            </td>
            <td className="playlistName">
                <Link to={"http://localhost:3000/playlist/" + playlistId}>{truncatedPlaylistName(playlistName)}</Link>
            </td>

		</tr>
	);
}

export default PublicPlaylist;