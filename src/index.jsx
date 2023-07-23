import React from 'react';
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom"
import Home from "./routes/home.jsx"
import Login from "./routes/login.jsx"
import Auth from "./routes/auth.jsx"
import Playlist from "./routes/playlist.jsx"
import "./App.css"
import mixpanel from 'mixpanel-browser';

var productionHost = 'playlistgen.com'; 
var devToken = '48bbe546e75208ca08d25f8fb7b469d6'; 
var prodToken = '85cd79bafd3553eb0658f852997f374c'; 
let token = devToken;
let debug = true;
if (window.location.hostname.toLowerCase().search(productionHost) > 0) { 
	token = prodToken;
	debug = false;
}
mixpanel.init(token, { debug: debug, track_pageview: true, persistence: 'localStorage' });

const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		path: "/auth",
		element: <Auth />,
	},
	{
		path: "/home",
		element: <Home />,
	},
	{
	  path: '/playlist/:playlistUrlId',
	  element: <Playlist />,
	},
]);



ReactDOM.createRoot(document.getElementById('root')).render(
	<RouterProvider router={router} />
)