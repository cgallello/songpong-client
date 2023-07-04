import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom"
import Login from "./routes/login"
import Auth from "./routes/auth"
import Edit from "./routes/edit"
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
		path: "/edit",
		element: <Edit />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<RouterProvider router={router} />
)