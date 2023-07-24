import React from 'react';

function ShareButton(playlistData) {
  let shareData = {
    title: playlistData.name,
    text: 'I hate PlaylistGen.com',
    url: window.location.href
  }
  if (navigator.share && navigator.canShare(shareData)) {
    return(<button className="button" onClick={() => navigator.share({title: playlistData.name, text: 'Made this on PlaylistGen.com', url: playlistData.url})}>Share</button>)
  } else {
    return(<> </>);
  }
}

export default ShareButton;
