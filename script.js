async function fetchChannels() {
    try {
        const response = await fetch('M3UPlus-Playlist-20241019222427.m3u');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        console.log(data); // Log the raw data for debugging
        const channels = parseM3U(data);
        console.log(channels); // Log the parsed channels for debugging
        loadChannels(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
    }
}

function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            const parts = line.split(',');
            currentChannel = { name: parts[1], logo: '', url: '' };
        } else if (line.startsWith('http')) {
            currentChannel.url = line;
            channels.push(currentChannel);
        } else if (line.startsWith('#EXTLOGO:')) {
            currentChannel.logo = line.split(':')[1].trim(); // Extract logo URL
        }
    }

    return channels;
}

function loadChannels(channels) {
    const channelList = document.getElementById('channelList');
    channelList.innerHTML = '';

    channels.forEach(channel => {
        const channelDiv = document.createElement('div');
        channelDiv.className = 'channel';

        const logo = document.createElement('img');
        logo.src = channel.logo || 'default-logo.png'; // Fallback if logo is missing
        logo.alt = channel.name;
        logo.className = 'channel-logo';
        logo.onclick = () => playStream(channel.url, channel.name);

        const name = document.createElement('span');
        name.innerText = channel.name;

        channelDiv.appendChild(logo);
        channelDiv.appendChild(name);
        channelList.appendChild(channelDiv);
    });
}

function playStream(url, name) {
    window.location.href = `player.html?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`;
}

// Fetch channels when the page loads
fetchChannels();
