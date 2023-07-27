import React from 'react';

function ShareButton(playlistData) {
  let shareData = {
    title: playlistData.name,
    text: 'I hate PlaylistGen.com',
    url: window.location.href
  }

  const handleShare = async () => {
    try {
      await navigator.share({title: playlistData.name, text: 'Made this on PlaylistGen.com', url: playlistData.url});
    } catch (error) {
      console.error('Share failed:', error.message);
    }
  }

  if (navigator.share && navigator.canShare(shareData)) {
    return(<button className="button" onClick={handleShare}>Share</button>)
  } else {
    return(<> </>);
  }
}

export default ShareButton;