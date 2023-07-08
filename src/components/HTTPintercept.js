import { clientId } from '../config';
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'localhost:3000',
	timeout: 5000
});

axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

axiosInstance.interceptors.response.use(
	(response) => { 
		console.log(response.data);
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
				axiosInstance.defaults.headers.common[
					'Authorization'
					] = `Bearer ${refreshResponse.data.access_token}`;
				axiosInstance.headers.Authorization = 'Bearer ' + refreshResponse.data.access_token;

				// Hoping that this updates the original request with the new token
				originalRequest.headers.Authorization = 'Bearer ' + refreshResponse.data.access_token;
				console.log(originalRequest);

				return axiosInstance(originalRequest);

			} catch (refreshError) {
				throw refreshError;
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;