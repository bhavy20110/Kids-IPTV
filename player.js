const urlParams = new URLSearchParams(window.location.search);
const streamUrl = urlParams.get('url');

const videoPlayer = document.getElementById('videoPlayer');
videoPlayer.src = streamUrl;

// Add error handling
videoPlayer.onerror = function() {
    alert('Error: Unable to play the stream. Please check the link.');
};
