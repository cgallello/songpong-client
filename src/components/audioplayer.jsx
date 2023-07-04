import React from 'react';

function AudioPlayer({ url }) {

	// const state = {
	// 	audio: new Audio(url),
	// 	isPlaying: false,
	// };

	// // Main function to handle both play and pause operations
	// function playPause() {

	// 	let isPlaying = this.state.isPlaying;
	// 	if (isPlaying) {
	// 		this.state.audio.pause();
	// 	} else {
	// 		this.state.audio.play();
	// 	}

	// 	// Change the state of song
	// 	this.setState({ isPlaying: !isPlaying });
	// };

	// return (
	// 	<div>
	// 		<p>
	// 			{this.state.isPlaying ? "Playing" : "Paused"}
	// 		</p>
	// 		<button onClick={this.playPause()}>
	// 			Play | Pause
	// 		</button>
	// 	</div>
	// );
}



export default AudioPlayer;

// https://www.geeksforgeeks.org/how-to-toggle-play-pause-in-reactjs-with-audio/