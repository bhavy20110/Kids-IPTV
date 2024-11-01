fetch('M3UPlus-Playlist-20241019222427.m3u')
    .then(response => response.text())
    .then(data => {
        const channels = parseM3U(data);
        console.log('Parsed Channels:', channels); // Debugging
        displayChannels(channels);
    })
    .catch(error => console.error('Error fetching M3U file:', error));

function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            if (currentChannel.name) {
                channels.push(currentChannel); // Save the last channel
                currentChannel = {}; // Reset for the next channel
            }
            const nameMatch = line.match(/,(.+)$/);
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);

            if (nameMatch) {
                currentChannel.name = nameMatch[1].trim(); // Channel name
            }
            if (logoMatch) {
                currentChannel.logo = logoMatch[1]; // Channel logo URL
            }
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line.trim(); // Channel URL
        }
    });

    if (currentChannel.name) {
        channels.push(currentChannel); // Save the last channel if exists
    }

    return channels;
}

function displayChannels(channels) {
    const container = document.getElementById('channel-list');
    container.innerHTML = ''; // Clear previous channels
    if (channels.length === 0) {
        container.innerHTML = '<p>No channels found</p>'; // Message if no channels
    } else {
        channels.forEach(channel => {
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

function playStream(url, name) {
    window.location.href = `player.html?url=${url}&name=${name}`; // Navigate to player page
}
