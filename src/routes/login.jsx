import { clientId, redirectUri } from '../config';

export default function Login() {

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
		let codeVerifier = generateRandomString(128);

		generateCodeChallenge(codeVerifier).then(codeChallenge => {
			let state = generateRandomString(16);
			let scope = 'user-read-private user-read-email playlist-modify-public streaming';

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
			<div className="homepage mainWrapper">
				<h1 className="logo">Song Pong</h1>
				<h2> Build playlists with friends for road trips, parties, and stuff</h2>
				<div className="loginWrapper">
					<div className="paddle one"></div>
					<button onClick={requestAuth} className="spotifyLogin">Login with Spotify</button>
					<div className="paddle two"></div>
				</div>
			</div>
		</main>
	);
}