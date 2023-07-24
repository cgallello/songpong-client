import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import WebPlayback from '../components/webplayback';
import TrackList from '../components/tracklist';
import { internalAxios, spotifyAxios } from '../components/HTTPintercept';
import BackButton from '../components/backbutton';
import ShareButton from '../components/sharebutton';
import mixpanel from 'mixpanel-browser';

export default function Playlist() {

	const isFirstRender = useRef(true)
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			mixpanel.track_pageview();
			return;
		}
	}, [])

	const { playlistUrlId } = useParams();
	const [playlistData, setPlaylistData] = useState(null);
	const [playlistTrackData, setPlaylistTrackData] = useState([]);
	const [playlistDataLoaded, setPlaylistDataLoaded] = useState(false);
	const [playlistId, setPlaylistId] = useState('');
	const [currentSong, setCurrentSongState] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);
	const [copied, setCopied] = useState(false);
	const location = useLocation();

	const urlParams = new URLSearchParams(window.location.search);

	let code = urlParams.get('p');
	useEffect(() => {
		getPlaylistAPI();
	}, [location.pathname]);

	async function getPlaylistAPI() {
		const endpointURL = 'https://api.spotify.com/v1/playlists/' + playlistUrlId + playlistId + '?&timestamp=' + new Date().getTime();
		let tmpResultsArray = [];
		try {
			const spotifyResponse = await spotifyAxios.get(endpointURL);
			// const internalResponse = await internalAxios.get('http://localhost:8000/api/playlists/' + playlistUrlId);
			// // const parsedInternalResponse = JSON.parse(internalResponse);
			document.title = spotifyResponse.data.name + ' – PlaylistGen.com';
			localStorage.setItem("playlistId", spotifyResponse.data.id);
			console.log(spotifyResponse.data);
			if (spotifyResponse.data.images[0] != null) {
				setPlaylistData({
					id: spotifyResponse.data.id,
					image: spotifyResponse.data.images[0].url,
					name: spotifyResponse.data.name,
					uri: spotifyResponse.data.uri,
					url: spotifyResponse.data.external_urls.spotify
				});
			} else {
				setPlaylistData({
					id: spotifyResponse.data.id,
					image: "",
					name: spotifyResponse.data.name,
					uri: spotifyResponse.data.uri
				});
			}

			// add spotify_avatar_url to item.track. spotify_avatar_url is part of the stringified json in internalResponse.data.tracks
			spotifyResponse.data.tracks.items.forEach((item, index) => {
				// if(internalResponse.data.tracks !== undefined) {
				// 	internalResponse.data.tracks.forEach((internalItem, internalIndex) => {
				// 		if(item.track.id === internalItem.spotify_track_id) {
				// 			item.track.spotify_avatar_url = internalItem.spotify_avatar_url;
				// 		}
				// 	});
				// }
				tmpResultsArray.push(item.track);
			});
			setPlaylistTrackData(tmpResultsArray);
			setPlaylistDataLoaded(true);
		} catch (error) { }
	}

	async function setSongAPI(track) {
		const endpointURL = 'https://api.spotify.com/v1/me/player/play?device_id=' + localStorage.getItem('device_id');
		try {
			const response = await spotifyAxios.put(endpointURL, {
				'context_uri': playlistData.uri,
				'offset': { 'uri': track.uri }
			});
		} catch (error) { }
	}

	const setCurrentSong = (track, action) => {
		setCurrentSongState(track);
		let spotifyProduct = localStorage.getItem('spotifyProduct');

		if(action == "trackClick"){
			mixpanel.track('Play Song', {"id" : track.id, "name" : track.name, "artist": track.artists[0].name });
			if (spotifyProduct == "premium") {
				setSongAPI(track);
			}
		} 

		if(action == "trackClick" || action == "prev_next"){
			currentAudio && currentAudio.pause();
			if (spotifyProduct == "free") {
				if (track.track.preview_url) {
					let audio = new Audio(track.track.preview_url)
					audio.play();
					setCurrentAudio(audio);
				}
			}
		}
	};

	function truncatedPlaylistName(playlistName){
		var trimmedString = playlistName.substr(0, 40); 
		if(playlistName.length > 40){
			return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + "...";
		} else {
			return trimmedString;
		}
	}

	return (
		<main>
			<div className="mainPadding">
				<div className="mainWrapper">
					<BackButton />
					{playlistDataLoaded &&
						<div className="editWrapper">
							<h1><img src={playlistData.image ? playlistData.image : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt={playlistData.name} className={playlistData.image ? "albumArtwork" : "albumArtwork empty"} />{truncatedPlaylistName(playlistData.name)}</h1>
							<div className="buttonRow">
								<button className="button" onClick={() => setCurrentSong(playlistTrackData[0], "trackClick")}>Play all ▶</button>
								<ShareButton {...{ playlistData }} />
								<button className="button" onClick={(() => {navigator.clipboard.writeText(playlistData.url); setCopied(true);})}>
									{!copied ? "Copy Spotify Link" : "Copied!"}
								</button>
							</div>

							<div style={{ overflowY: 'scroll', height: 'calc(100% - 40px)' }}>
								<TrackList tracks={playlistTrackData} playlistId={code} currentSong={currentSong} setCurrentSong={setCurrentSong} />
							</div>
						</div>
					}
					{!playlistDataLoaded &&
						<p>Loading...</p>
					}
				</div>
			</div>
			<WebPlayback {...{ access_token: localStorage.getItem('access_token'), currentSong, setCurrentSong }} />
		</main>
	);
}