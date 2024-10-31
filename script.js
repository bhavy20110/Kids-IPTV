fetch('M3UPlus-Playlist-20241019222427.m3u')
    .then(response => response.text())
    .then(data => {
        const channels = parseM3U(data);
        console.log('Parsed Channels:', channels); // Log parsed channels for debugging
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
                channels.push(currentChannel); // Push the last channel
                currentChannel = {}; // Reset for next channel
            }
            const nameMatch = line.match(/,(.+)$/);
            if (nameMatch) {
                currentChannel.name = nameMatch[1].trim(); // Trim whitespace
            }
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line.trim(); // Trim whitespace
            currentChannel.logo = getLogo(currentChannel.name); // Get logo based on name
        }
    });

    if (currentChannel.name) {
        channels.push(currentChannel); // Push the last channel if exists
    }

    return channels;
}

function getLogo(channelName) {
    const logos = {
        'DISNEY INDIA': 'path/to/disney_logo.png',
        'CNN': 'path/to/cnn_logo.png',
        // Add more channels and their logos here
    };

    return logos[channelName] || 'path/to/default_logo.png'; // Default logo if not found
}

function displayChannels(channels) {
    const container = document.getElementById('channel-container');
    container.innerHTML = ''; // Clear the container before displaying
    channels.forEach(channel => {
        const channelDiv = document.createElement('div');
        channelDiv.classList.add('channel');
        channelDiv.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}" class="channel-logo" onclick="playStream('${encodeURIComponent(channel.url)}', '${encodeURIComponent(channel.name)}')">
            <p>${channel.name}</p>
        `;
        container.appendChild(channelDiv);
    });
}

function playStream(url, name) {
    window.location.href = `player.html?url=${url}&name=${name}`; // Navigate to player page
}
