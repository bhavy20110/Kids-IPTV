const urlParams = new URLSearchParams(window.location.search);
const videoSrc = urlParams.get('url');
const channelName = urlParams.get('name');

document.getElementById('channel-name').textContent = `Playing: ${channelName}`;

if (Hls.isSupported()) {
    const video = document.getElementById('video');
    const hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
    });
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
    video.addEventListener('loadedmetadata', function () {
        video.play();
    });
} else {
    alert("Error: Unable to play the stream. Please check the link.");
}
