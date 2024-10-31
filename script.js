fetch('M3UPlus-Playlist-20241019222427.m3u')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        console.log('Fetched M3U Data:', data); // Debugging: Check if data is fetched correctly
        const channels = parseM3U(data);
        console.log('Parsed Channels:', channels); // Debugging
        displayChannels(channels);
    })
    .catch(error => console.error('Error fetching M3U file:', error));

function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach((line, index) => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            if (currentChannel.name) {
                channels.push(currentChannel); // Save the last channel
                currentChannel = {}; // Reset for the next channel
            }
            const nameMatch = line.match(/,(.+)$/);
            if (nameMatch) {
                currentChannel.name = nameMatch[1].trim(); // Channel name
                console.log(`Found Channel: ${currentChannel.name}`); // Debugging
            }
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line.trim(); // Channel URL
            currentChannel.logo = getLogo(currentChannel.name); // Get logo
        }
    });

    if (currentChannel.name) {
        channels.push(currentChannel); // Save the last channel if exists
    }

    console.log(`Total Channels Parsed: ${channels.length}`); // Debugging
    return channels;
}

function getLogo(channelName) {
    const logos = {
        'DISNEY INDIA': 'path/to/disney_logo.png',
        'CNN': 'path/to/cnn_logo.png',
        // Add more channel names and their corresponding logo paths
    };
    return logos[channelName] || 'path/to/default_logo.png'; // Default logo if not found
}
function displayChannels(channels) {
    const container = document.getElementById('channel-list'); // Updated ID
    container.innerHTML = ''; // Clear previous channels
    if (channels.length === 0) {
        container.innerHTML = '<p>No channels found</p>'; // Message if no channels
    } else {
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
}
}

function playStream(url, name) {
    window.location.href = `player.html?url=${url}&name=${name}`; // Navigate to player page
}
