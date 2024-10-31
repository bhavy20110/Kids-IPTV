const urlParams = new URLSearchParams(window.location.search);
const streamUrl = urlParams.get('url');

const videoPlayer = document.getElementById('videoPlayer');

// Check for HLS support
if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(videoPlayer);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        videoPlayer.play();
    });
} else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
    // If the browser is Safari
    videoPlayer.src = streamUrl;
    videoPlayer.addEventListener('loadedmetadata', function() {
        videoPlayer.play();
    });
} else {
    alert('Error: Unable to play the stream. Please check the link.');
}
