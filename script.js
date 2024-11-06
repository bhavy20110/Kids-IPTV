// Fetch the local M3U playlist
fetch('M3UPlus-Playlist-20241019222427.m3u')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        const channels = parseM3U(data);
        console.log('Parsed Channels:', channels); // Debugging: Logs parsed channels
        displayChannels(channels);
    })
    .catch(error => {
        console.error('Error fetching M3U file:', error);
        document.getElementById('channel-list').innerHTML = `<p class="error-message">Failed to load channels: ${error.message}</p>`;
    });

// Function to parse the M3U file and extract channel information
function parseM3U(data) {
    const lines = data.split('\n'); // Split data by lines
    const channels = []; // Array to store channel objects
    let currentChannel = {}; // Temporary object to hold current channel data

    lines.forEach(line => {
        line = line.trim(); // Remove whitespace
        if (line.startsWith('#EXTINF:')) {
            if (currentChannel.name) {
                channels.push(currentChannel); // Push the completed channel to the list
                currentChannel = {}; // Reset for the next channel
            }
            const nameMatch = line.match(/,(.+)$/); // Extract channel name
            const logoMatch = line.match(/tvg-logo="([^"]+)"/); // Extract logo URL from M3U
            if (nameMatch) {
                currentChannel.name = nameMatch[1].trim();
            }
            if (logoMatch) {
                currentChannel.logo = logoMatch[1];
            }
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line.trim(); // Set the URL of the stream
        }
    });

    // Push the last channel if exists
    if (currentChannel.name) {
        channels.push(currentChannel);
    }

    return channels;
}

// Function to display channels in the HTML
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

// Function to navigate to player.html with URL parameters for streaming
function playStream(url, name) {
    window.location.href = `player.html?url=${url}&name=${name}`;
}
