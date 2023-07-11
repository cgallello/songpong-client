import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import WebPlayback from '../components/webplayback';
import TrackList from '../components/tracklist';
import { spotifyAxios } from '../components/HTTPintercept';
import BackButton from '../components/backbutton';

export default function Playlist() {

	const { playlistUrlId } = useParams();
	const [playlistData, setPlaylistData] = useState(null);
	const [playlistTrackData, setPlaylistTrackData] = useState([]);
	const [playlistDataLoaded, setPlaylistDataLoaded] = useState(false);
	const [playlistId, setPlaylistId] = useState('');
	const [currentSong, setCurrentSongState] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);
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
			const response = await spotifyAxios.get(endpointURL);
			document.title = response.data.name + ' – Song Pong';
			localStorage.setItem("playlistId", response.data.id);
			if (response.data.images[0] != null) {
				setPlaylistData({
					id: response.data.id,
					image: response.data.images[0].url,
					name: response.data.name,
					uri: response.data.uri
				});
			} else {
				setPlaylistData({
					id: response.data.id,
					image: "",
					name: response.data.name,
					uri: response.data.uri
				});
			}

			response.data.tracks.items.forEach((item, index) => {
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

	const setCurrentSong = (track) => {
		setCurrentSongState(track);
		currentAudio && currentAudio.pause();
		let spotifyProduct = localStorage.getItem('spotifyProduct');
		if (spotifyProduct == "free") {
			if (track.track.preview_url) {
				let audio = new Audio(track.track.preview_url)
				audio.play();
				setCurrentAudio(audio);
			}
		} else if (spotifyProduct == "premium") {
			setSongAPI(track);
		}
	};

	return (
		<main>
			<div className="mainPadding">
				<div className="mainWrapper">
					<BackButton />
					{playlistDataLoaded &&
						<div className="editWrapper">
							<h1><img src={playlistData.image ? playlistData.image : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt={playlistData.name} className={playlistData.image ? "albumArtwork" : "albumArtwork empty"} />{playlistData.name}</h1>
							<a href="/search">
								<div className="addContainer">It's your turn! Add 3 songs
									<div className="arrow">
										<svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.42298 7.43117L1.66833 13.1858C1.35335 13.5008 0.814778 13.2777 0.814778 12.8323L0.814778 1.32297C0.814778 0.877518 1.35335 0.654434 1.66833 0.969416L7.42298 6.72407C7.61824 6.91933 7.61824 7.23591 7.42298 7.43117Z" stroke="white" strokeLinejoin="round"/>
										</svg>
									</div>
								</div>
							</a>
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