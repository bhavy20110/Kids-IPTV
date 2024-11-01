function fetchPlaylist() {
    fetch('M3UPlus-Playlist-20241019222427.m3u')
        .then(response => response.text())
        .then(data => {
            const channels = parseM3U(data);
            displayChannels(channels);
        })
        .catch(error => console.error('Error fetching M3U file:', error));
}

function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            if (currentChannel.name) {
                channels.push(currentChannel);
                currentChannel = {};
            }
            const nameMatch = line.match(/,(.+)$/);
            if (nameMatch) currentChannel.name = nameMatch[1].trim();
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line.trim();
            currentChannel.logo = parseLogo(line); // Extract logo if available
        }
    });

    if (currentChannel.name) channels.push(currentChannel);

    return channels;
}

function parseLogo(line) {
    const logoMatch = line.match(/tvg-logo="(.+?)"/);
    return logoMatch ? logoMatch[1] : 'path/to/default_logo.png';
}

async function unshortenURL(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors',
            redirect: 'follow',
        });
        return response.url || url;
    } catch (error) {
        console.warn(`Failed to unshorten URL ${url}:`, error);
        return url; // If unshortening fails, return the original URL
    }
}

async function displayChannels(channels) {
    const container = document.getElementById('channel-container');
    container.innerHTML = '';

    for (const channel of channels) {
        const unshortenedURL = await unshortenURL(channel.url);

        const channelDiv = document.createElement('div');
        channelDiv.classList.add('channel');
        channelDiv.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}" class="channel-logo" onclick="playStream('${encodeURIComponent(unshortenedURL)}', '${encodeURIComponent(channel.name)}')">
            <p>${channel.name}</p>
        `;
        container.appendChild(channelDiv);
    }
}

function playStream(url, name) {
    const decodedURL = decodeURIComponent(url);
    const videoElement = document.getElementById('video-player');
    videoElement.src = ''; // Reset src to avoid conflicts
    videoElement.pause();

    if (Hls.isSupported()) {
        console.log(`Trying to play with Hls.js: ${decodedURL}`);
        const hls = new Hls();
        hls.loadSource(decodedURL);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play();
            console.log(`Playing ${name} with Hls.js`);
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error(`Hls.js error for ${name}:`, data);
            hls.destroy();
            tryVideoJS(decodedURL, name, videoElement); // Fallback to Video.js
        });
    } else {
        tryVideoJS(decodedURL, name, videoElement);
    }
}

function tryVideoJS(url, name, videoElement) {
    console.log(`Attempting fallback with Video.js: ${url}`);
    const player = videojs(videoElement, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        sources: [{
            src: url,
            type: 'application/x-mpegURL' // Type for HLS streams
        }]
    });

    player.ready(() => {
        console.log(`Playing ${name} with Video.js`);
        player.play();
    });

    player.on('error', () => {
        console.error(`Video.js error for ${name}: Unable to play the stream`);
    });
}
