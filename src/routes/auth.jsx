import { clientId, redirectUri } from '../config';

export default function Auth() {
	const urlParams = new URLSearchParams(window.location.search);
	let code = urlParams.get('code');
	let codeVerifier = localStorage.getItem('code_verifier');
	let body = new URLSearchParams({
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: redirectUri,
		client_id: clientId,
		code_verifier: codeVerifier
	});

	const response = fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: body
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('HTTP status ' + response.status);
			}
			return response.json();
		})
		.then(data => {
			localStorage.setItem('access_token', data.access_token);
			localStorage.setItem('refresh_token', data.refresh_token);
			getProfile(data.access_token);
		})
		.catch(error => {
			console.error('Error:', error);
		});

	async function getProfile(accessToken) {
		const response = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: 'Bearer ' + accessToken
			}
		});

		const data = await response.json();
		const spotifyId = data.id;
		localStorage.setItem('spotifyId', spotifyId);
		localStorage.setItem('spotifyProduct', data.product);

		postUser(data);
		window.location = '/home';
	}

	async function postUser(data) {

		const endpointURL = 'http://localhost:8000/users';
		const response = fetch(endpointURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				spotify_id: data.id,
				access_token: data.access_token,
				refresh_token: data.refresh_token,
				email: data.email,
				display_name: data.display_name,
				spotify_avatar_url: data.images.url,
				product: data.product,
				playlists: []
			})
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('HTTP status ' + response.status + response.message);
				}
				return response.json();
			})
			.then(data => {
				alert("success");
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}


	return (
		<main>
		</main>
	);
}