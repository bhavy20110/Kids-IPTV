// script.js

// Function to fetch the M3U file via CORS proxy
fetch(`/api/cors-proxy?url=${encodeURIComponent('M3UPlus-Playlist-20241019222427.m3u')}`)
    .then(response => response.text())
    .then(data => {
        const channels = parseM3U(data);
        console.log('Parsed Channels:', channels); // Debugging: Logs parsed channels
        displayChannels(channels);
    })
    .catch(error => console.error('Error fetching M3U file:', error));

// Function to parse the M3U data
function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            const channelInfo = line.split(',');
            const name = channelInfo[1] || 'Unknown Channel';
            const logo = channelInfo[2] || null; // Assuming the logo URL is provided in EXTINF
            currentChannel = { name, logo };
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line; // This line should be the URL
            channels.push(currentChannel);
        }
    });

    return channels;
}

// Function to display channels on the page
function displayChannels(channels) {
    const container = document.getElementById('channel-list');
    container.innerHTML = ''; // Clear any existing content

    if (channels.length === 0) {
        container.innerHTML = '<p>No channels found</p>';
        console.warn('No channels were parsed from the M3U file.');
    } else {
        channels.forEach(channel => {
            console.log('Displaying channel:', channel); // Debug each channel
            const channelDiv = document.createElement('div');
            channelDiv.classList.add('channel');
            channelDiv.innerHTML = `
                <img src="${channel.logo || 'path/to/default_logo.png'}" alt="${channel.name}" class="channel-logo" onclick="playStream('${encodeURIComponent(channel.url)}', '${encodeURIComponent(channel.name)}')">
                <p>${channel.name}</p>
            `;
            container.appendChild(channelDiv);
        });
    }
}

// Function to handle playing the stream
function playStream(url, name) {
    window.location.href = `player.html?url=${url}&name=${name}`;
}
