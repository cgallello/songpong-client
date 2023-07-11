import { clientId } from '../config';
import axios from 'axios';

export const spotifyAxios = axios.create({
	baseURL: 'localhost:3000',
	timeout: 5000
});
spotifyAxios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
spotifyAxios.defaults.headers.common['Content-Type'] = 'application/json';

export const internalAxios = axios.create({
	baseURL: 'localhost:3000',
	timeout: 5000
});
internalAxios.defaults.headers.common['Content-Type'] = 'application/json';


spotifyAxios.interceptors.response.use(
	(response) => { 
		return response; 
	},
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshResponse = await axios.post(
					'https://accounts.spotify.com/api/token',
					{
						grant_type: 'refresh_token',
						refresh_token: localStorage.getItem('refresh_token'),
						client_id: clientId
					}, {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				);
				localStorage.setItem('access_token', refreshResponse.data.access_token);
				localStorage.setItem('refresh_token', refreshResponse.data.refresh_token);
				// spotifyAxios.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;
				spotifyAxios.headers.Authorization = 'Bearer ' + refreshResponse.data.access_token;

				// Hoping that this updates the original request with the new token
				// originalRequest.headers.Authorization = 'Bearer ' + refreshResponse.data.access_token;
				console.log(originalRequest);

				return spotifyAxios(originalRequest);

			} catch (refreshError) {
				throw refreshError;
			}
		}
		return Promise.reject(error);
	}
);
