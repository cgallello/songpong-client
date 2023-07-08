import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom"
import Home from "./routes/home"
import Login from "./routes/login"
import Auth from "./routes/auth"
import Search from "./routes/search"
import Playlist from "./routes/playlist"
import "./App.css"

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
		path: "/search",
		element: <Search />,
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