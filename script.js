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
        const groups = getGroups(channels);
        setupGroupFilter(groups);
        setupPagination(channels);
        displayChannels(channels.slice(0, 7)); // Display first 7 channels by default
    })
    .catch(error => console.error('Error fetching M3U file:', error));

// Parse M3U file
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
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            const groupMatch = line.match(/group-title="([^"]+)"/);
            if (nameMatch) currentChannel.name = nameMatch[1].trim();
            if (logoMatch) currentChannel.logo = logoMatch[1];
            if (groupMatch) currentChannel.group = groupMatch[1];
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line.trim();
        }
    });

    if (currentChannel.name) channels.push(currentChannel);
    return channels;
}

// Extract unique groups for filtering
function getGroups(channels) {
    const groups = new Set();
    channels.forEach(channel => {
        if (channel.group) groups.add(channel.group);
    });
    return Array.from(groups);
}

// Display channels with pagination
let currentPage = 1;
let itemsPerPage = 7;
function setupPagination(channels) {
    const totalPages = Math.ceil(channels.length / itemsPerPage);
    document.getElementById('channel-list').innerHTML = ''; // Clear any existing content

    const renderPage = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        displayChannels(channels.slice(start, end));

        // Display pagination info
        document.getElementById('pagination').innerHTML = `
            Page ${currentPage} of ${totalPages}
            <button onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <button onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
    };

    window.prevPage = () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    };

    window.nextPage = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    };

    renderPage();
}

// Display channels in the HTML
function displayChannels(channels) {
    const container = document.getElementById('channel-list');
    container.innerHTML = '';

    if (channels.length === 0) {
        container.innerHTML = '<p>No channels found</p>';
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

// Set up group filter dropdown
function setupGroupFilter(groups) {
    const groupSelect = document.getElementById('group-filter');
    groupSelect.innerHTML = `<option value="">All Groups</option>`;
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });

    groupSelect.addEventListener('change', function () {
        const selectedGroup = this.value;
        const filteredChannels = selectedGroup ? channels.filter(c => c.group === selectedGroup) : channels;
        setupPagination(filteredChannels);
    });
}

// Search feature
document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredChannels = channels.filter(channel => channel.name.toLowerCase().includes(searchTerm));
    setupPagination(filteredChannels);
});

function playStream(url, name) {
    const proxyUrl = `proxy.html?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`;
    window.location.href = proxyUrl;
}
