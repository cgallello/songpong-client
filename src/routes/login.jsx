import { clientId, redirectUri } from '../config.js';
import mixpanel from 'mixpanel-browser';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {

	const isFirstRender = useRef(true)
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			if(localStorage.getItem('access_token')) {
				window.location = '/home';
			} else {
				mixpanel.track_pageview();
			}
			return;
		}
	}, [])

	function generateRandomString(length) {
		let text = '';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	async function generateCodeChallenge(codeVerifier) {
		function base64encode(string) {
			return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=+$/, '');
		}

		const encoder = new TextEncoder();
		const data = encoder.encode(codeVerifier);
		const digest = await window.crypto.subtle.digest('SHA-256', data);

		return base64encode(digest);
	}

	function requestAuth() {
		mixpanel.track('Spotify login click');

		let codeVerifier = generateRandomString(128);

		generateCodeChallenge(codeVerifier).then(codeChallenge => {
			let state = generateRandomString(16);
			let scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private streaming';

			localStorage.setItem('code_verifier', codeVerifier);

			let args = new URLSearchParams({
				response_type: 'code',
				client_id: clientId,
				scope: scope,
				redirect_uri: redirectUri,
				state: state,
				code_challenge_method: 'S256',
				code_challenge: codeChallenge
			});

			window.location = 'https://accounts.spotify.com/authorize?' + args;
		});
	}

	return (
		<main>
			{/* <div className="fadedWrapper"><div className="fadedWrapper"><div className="fadedWrapper"> */}
				<div className="homepage mainWrapper">
					<h1 className="logo">Playlist Gen <span className="faded">(dot com)</span></h1>
					<h2>Paste in your dark confessions to share them as a playlist</h2>
					<div className="loginWrapper">
						<button onClick={requestAuth} className="spotifyLogin">Login with Spotify</button>
					</div>
					<p className="legal">By logging in, you agree to our <Link to="/privacy">privacy policy</Link>.</p>
					<p className="builtby">Built by <a href="https://www.twitter.com/cgallello">@cgallello</a> and <a href="https://twitter.com/stedmanhalliday">@stedmanhalliday</a>.</p>
				</div>
			{/* </div></div></div> */}
		</main>
	);
}