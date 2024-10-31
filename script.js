async function fetchM3U(url) {
    const response = await fetch(url);
    const data = await response.text();
    return parseM3U(data);
}

function parseM3U(data) {
    const lines = data.split('\n');
    const streams = [];
    let currentStream = {};

    lines.forEach((line) => {
        if (line.startsWith('#EXTM3U') || line.trim() === '') return;
        if (line.startsWith('#EXTINF')) {
            if (currentStream.url) {
                streams.push(currentStream);
            }
            const info = line.split(',');
            currentStream = {
                name: info[1].trim(),
                url: '',
                logo: ''
            };
        } else if (currentStream.url === '') {
            currentStream.url = line.trim();
        } else if (line.startsWith('http')) {
            currentStream.logo = line.trim();
        }
    });
    if (currentStream.url) streams.push(currentStream);
    return streams;
}

async function initializePlayer() {
    const streams = await fetchM3U('M3UPlus-Playlist-20241019222427.m3u');
    const channelList = document.getElementById('channel-list');
    streams.forEach(stream => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-item';
        channelItem.innerHTML = `
            <a href="player.html?url=${encodeURIComponent(stream.url)}&name=${encodeURIComponent(stream.name)}">
                <img src="${stream.logo}" alt="${stream.name}" class="channel-logo">
                <span>${stream.name || 'Unknown Channel'}</span>
            </a>
        `;
        channelList.appendChild(channelItem);
    });
}

// Initialize player on load
initializePlayer();
