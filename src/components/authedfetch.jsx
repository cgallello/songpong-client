// import { clientId } from '../config';
// import React, { useState } from 'react';

// export default function AuthedFetch(url, fetchParams, callback) {  
    
//     // This function makes the HTTP request on behalf of the parent component.
//     // If the request fails due to a 401 unauthorized, it refreshes the app's
//     // access token using the refresh token. It then tries the original
//     // request again. If the original request fails AGAIN due to a 401, 
//     // we redirect to the homepage. This function should NOT be used for auth-
//     // related requests since it doesn't support modifying the header. 
// 	// const [retried, setRetried] = useState(false);
//     let retried = false; 

//     function originalRequest(url, fetchParams, callback){
//         return fetch(url, fetchParams.concat({
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: 'Bearer ' + localStorage.getItem('access_token')
//             }
//         }))
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('HTTP status ' + response.status + response.message);
//                 }

// 				if(response.status == 401){ 
//                     return refreshTokenAPI(url, fetchParams, callback);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 callback(data);
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//     }


//     function refreshTokenAPI(url, fetchParams, callback){
//         return fetch('https://accounts.spotify.com/api/token', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: {
//                 grant_type: 'refresh_token',
//                 refresh_token: localStorage.getItem('refresh_token'),
//                 client_id: clientId
//             }
// 	    })
// 		.then(response => {
// 			if (!response.ok) {
//                 if(response.status == 401){ window.location = '/'; }
// 				throw new Error('HTTP status ' + response.status);
// 			}
// 			return response.json();
// 		})
// 		.then(data => {
// 			localStorage.setItem('access_token', data.access_token);
// 			localStorage.setItem('refresh_token', data.refresh_token);
//             if(!retried){
//                 retried = true;
//                 return originalRequest(url, fetchParams, callback);
//             } else {
//                 window.location = '/';
//             }

// 		})
// 		.catch(error => {
// 			console.error('Error:', error);
// 		});
//     }

//     //

//     //
//     return originalRequest(url, fetchParams, callback);
// }