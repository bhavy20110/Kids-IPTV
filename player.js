const urlParams = new URLSearchParams(window.location.search);
const streamUrl = urlParams.get('url');

const videoPlayer = document.getElementById('videoPlayer');
videoPlayer.src = streamUrl;

// Initialize Video.js
const player = videojs(videoPlayer);

// Add error handling
player.on('error', function() {
    alert('Error: Unable to play the stream. Please check the link.');
});
