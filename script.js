// Function to fetch channels from the M3U file
async function fetchChannels() {
    const response = await fetch('M3UPlus-Playlist-20241019222427.m3u');
    const data = await response.text();
    const channels = parseM3U(data);
    loadChannels(channels);
}

// Function to parse M3U file content
function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach(line => {
        if (line.startsWith('#EXTINF:')) {
            const parts = line.split(',');
            const name = parts[1].trim();
            currentChannel = { name };
        } else if (line.trim()) {
            currentChannel.url = line.trim();
            channels.push(currentChannel);
        }
    });

    return channels;
}

// Load channels into the GUI
function loadChannels(channels) {
    const channelList = document.getElementById('channelList');
    channelList.innerHTML = '';

    channels.forEach(channel => {
        const logo = channel.name.toLowerCase().replace(/ /g, '-') + '.png';
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-item';
        channelItem.innerHTML = `
            <img src="logos/${logo}" alt="${channel.name} logo" class="channel-logo" />
            <span class="channel-name">${channel.name}</span>
            <button onclick="playStream('${encodeURIComponent(channel.url)}', '${channel.name}')">Play</button>
        `;
        channelList.appendChild(channelItem);
    });
}

// Function to play the selected stream
function playStream(url, name) {
    window.location.href = `player.html?url=${url}&name=${name}`;
}

// Initialize fetching channels on page load
window.onload = fetchChannels;
