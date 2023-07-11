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

function WebPlayback({access_token, currentSong, setCurrentSong}) {
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
                // console.log('Ready with Device ID', device_id);
                localStorage.setItem("device_id", device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                // console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {
                if (!state) {
                    return;
                }
                // setTrack and setCurrentSong should probably be combined into one state.
                setTrack(state.track_window.current_track);
                setCurrentSong(state.track_window.current_track);
                if(typeof state.paused !== 'undefined'){
                    setPaused(state.paused);
                }
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                    if(typeof state.paused !== 'undefined'){
                        if(state.paused && state.position === 0){
                            setPaused(state.paused);
                        }
                    }
                });
                setCurrentSong(state.track_window.current_track, 'previous_next');
            }));
            player.connect();
        };
    }, []);

    return (
        <>
            <div className={currentSong ? "playbackContainer" : "playbackContainer hidden"} key={currentSong}>
                {current_track.album && 
                    <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
                }
                <div className="now-playing__track-info">
                    <div className="now-playing__name">{current_track.name}</div>
                    <div className="now-playing__artist">{current_track.artists[0].name}</div>
                </div>
                <div className="now-playing__controls">
                    <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                        ◀
                    </button>

                    <button className="btn-spotify playpause" onClick={() => { player.togglePlay() }} >
                        { is_paused ? "PLAY" : "PAUSE" }
                    </button>

                    <button className="btn-spotify" onClick={() => { player.nextTrack(); }} >
                        ▶
                    </button>
                </div>
            </div>
        </>
    );
}

export default WebPlayback
