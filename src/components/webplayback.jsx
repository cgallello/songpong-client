import React, { useState, useEffect } from 'react';
import mixpanel from 'mixpanel-browser';

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
    const [oldState, setOldState] = useState(track);

    useEffect(() => {
        if(currentSong){
            setTrack(currentSong);
        }
    }, [currentSong]);

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

                if(typeof state.paused !== 'undefined' && state.paused){
                    setPaused(state.paused);
                    console.log("pause");
                }

                // Detect end of track
                let oldState = window.oldState;
                if(oldState){
                    let currentTrackId = oldState.track_window.current_track.id;
                    for(let i = 0; i < state.track_window.previous_tracks.length; i++){
                        if(state.track_window.previous_tracks[i].id === currentTrackId){
                            let track = state.track_window.current_track;
                            mixpanel.track('Continue Song', {"id" : track.id, "name" : track.name, "artist": track.artists[0].name });
                            setCurrentSong(track, 'continue');
                            setTrack(track);
                        }
                    }
                }
                window.oldState = state;
                
                player.getCurrentState().then( state => { 
                    if(state !== null){
                        (!state)? setActive(false) : setActive(true) 
                        if(typeof state.paused !== 'undefined'){
                            if(state.paused && state.position === 0){
                                setPaused(state.paused);
                            }
                        }
                    }
                });
            }));
            player.connect();
        };
    }, []);

    function nextTrack(){
        player.nextTrack().then(() => {
            player.getCurrentState().then( state => { 
                if (!state) { return; }
                if(state.track_window.next_tracks.length === 0){ return; }
                let track = state.track_window.next_tracks[0];
                mixpanel.track('Next Song', {"id" : track.id, "name" : track.name, "artist": track.artists[0].name });
                setCurrentSong(track, 'prev_next');
                setTrack(state.track_window.current_track);
            });
        });
    }

    function previousTrack(){
        player.previousTrack().then(() => {
            player.getCurrentState().then( state => { 
                if (!state) { return; }
                if(state.track_window.previous_tracks.length === 0){ return; }
                let track = state.track_window.previous_tracks[state.track_window.previous_tracks.length - 1];
                mixpanel.track('Previous Song', {"id" : track.id, "name" : track.name, "artist": track.artists[0].name });
                setCurrentSong(track, 'prev_next');
                setTrack(state.track_window.current_track);
            });
        });
    }

    function togglePlay(){
        player.togglePlay().then(() => {
            player.getCurrentState().then( state => { 
                if (!state) { return; }
                if(state.paused){
                    mixpanel.track('Pause Song', {"id" : track.id, "name" : track.name, "artist": track.artists[0].name });
                } else {
                    mixpanel.track('Play Song', {"id" : track.id, "name" : track.name, "artist": track.artists[0].name });
                }
            });
        });
    }

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
                    <button className="btn-spotify" onClick={() => { previousTrack() }} >
                        ◀
                    </button>

                    <button className="btn-spotify playpause" onClick={() => { togglePlay() }} >
                        { is_paused ? "PLAY" : "PAUSE" }
                    </button>

                    <button className="btn-spotify" onClick={() => { nextTrack(); }} >
                        ▶
                    </button>
                </div>
            </div>
        </>
    );
}

export default WebPlayback
