document.addEventListener('DOMContentLoaded', function() {
    const channelContainer = document.getElementById('channel-container');
    const videoElement = document.getElementById('video-player');
    let player = null; // Initialize player variable for Video.js fallback

    // Function to fetch and parse M3U playlist
    async function loadChannels() {
        try {
            const response = await fetch('path/to/your.m3u'); // Replace with your actual M3U file path
            const m3uText = await response.text();
            const channels = parseM3U(m3uText);
            displayChannels(channels);
        } catch (error) {
            console.error('Error loading channels:', error);
        }
    }

    // Function to parse M3U text and extract channel info
    function parseM3U(m3uText) {
        const channels = [];
        const lines = m3uText.split('\n');
        let currentChannel = {};

        lines.forEach(line => {
            line = line.trim();

            if (line.startsWith('#EXTINF')) {
                const nameMatch = line.match(/,(.*)$/);
                if (nameMatch) {
                    currentChannel.name = nameMatch[1];
                }
                const logoMatch = line.match(/tvg-logo="(.*?)"/);
                if (logoMatch) {
                    currentChannel.logo = logoMatch[1];
                }
            } else if (line && !line.startsWith('#')) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = {};
            }
        });
        return channels;
    }

    // Function to display channels in the UI
    function displayChannels(channels) {
        channelContainer.innerHTML = ''; // Clear any existing channels
        channels.forEach(channel => {
            const channelDiv = document.createElement('div');
            channelDiv.classList.add('channel');
            channelDiv.innerHTML = `
                <img src="${channel.logo || 'default-logo.png'}" alt="${channel.name}" class="channel-logo">
                <p>${channel.name}</p>
            `;
            channelDiv.addEventListener('click', () => playChannel(channel.url));
            channelContainer.appendChild(channelDiv);
        });
    }

    // Function to play the selected channel
    function playChannel(url) {
        // Destroy existing Video.js player if it exists
        if (player) {
            player.dispose();
            player = null;
        }

        // Check if Hls.js is supported and try playing
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoElement);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                videoElement.play();
            });
            hls.on(Hls.Events.ERROR, function(event, data) {
                if (data.fatal) {
                    hls.destroy();
                    fallbackToVideoJs(url);
                }
            });
        } else {
            // If Hls.js is not supported, try Video.js as fallback
            fallbackToVideoJs(url);
        }
    }

    // Function to initialize Video.js player as fallback
    function fallbackToVideoJs(url) {
        player = videojs(videoElement, {
            sources: [{ src: url, type: 'application/x-mpegURL' }],
            autoplay: true,
            controls: true
        });
        player.ready(function() {
            player.play();
        });
    }

    // Load channels when the page is ready
    loadChannels();
});
