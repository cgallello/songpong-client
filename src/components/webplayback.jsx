import React, { useState, useEffect } from 'react';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback({access_token, currentSong}) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Song Pong',
                getOAuthToken: cb => { cb(access_token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                localStorage.setItem("device_id", device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {
                if (!state) {
                    return;
                }
                setTrack(state.track_window.current_track);
                setPaused(state.paused);
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                    if(state.paused && state.position === 0){
                        setPaused(state.paused);
                    }
                });
            }));
            player.connect();
        };
    }, []);

    return (
        <>
            <div className={currentSong ? "playbackContainer" : "playbackContainer hidden"} key={currentSong}>
                <img src={current_track.album ? current_track.album.images[0].url : ""} className="now-playing__cover" alt="" />
                <div className="now-playing__track-info">
                    <div className="now-playing__name">{current_track.name}</div>
                    <div className="now-playing__artist">{current_track.artists[0].name}</div>
                </div>
                <div className="now-playing__controls">
                    {/* <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                        &lt;&lt;
                    </button> */}

                    <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                        { is_paused ? "PLAY" : "PAUSE" }
                    </button>

                    {/* <button className="btn-spotify" onClick={() => { player.nextTrack(); }} >
                        &gt;&gt;
                    </button> */}
                </div>
            </div>
        </>
    );
}

export default WebPlayback
