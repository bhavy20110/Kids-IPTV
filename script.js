const CHANNELS_PER_PAGE = 7;
let channels = [];
let currentPage = 1;
let currentGroup = 'all';
let searchQuery = '';

// Fetch the local M3U playlist
fetch('M3UPlus-Playlist-20241019222427.m3u')
    .then(response => response.ok ? response.text() : Promise.reject(response.statusText))
    .then(data => {
        channels = parseM3U(data);
        populateGroups();
        displayChannels();
    })
    .catch(error => console.error('Error fetching M3U file:', error));

// Parse the M3U file
function parseM3U(data) {
    const lines = data.split('\n');
    const parsedChannels = [];
    let currentChannel = {};
    
    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            if (currentChannel.name) {
                parsedChannels.push(currentChannel);
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
    if (currentChannel.name) parsedChannels.push(currentChannel);
    return parsedChannels;
}

// Populate group select options
function populateGroups() {
    const groupSelect = document.getElementById('group-select');
    const groups = Array.from(new Set(channels.map(channel => channel.group || 'Ungrouped')));
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });
}

// Display channels with pagination, search, and group filter
function displayChannels() {
    const container = document.getElementById('channel-list');
    container.innerHTML = ''; // Clear current channels
    const filteredChannels = channels.filter(channel =>
        (currentGroup === 'all' || channel.group === currentGroup) &&
        (!searchQuery || channel.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const start = (currentPage - 1) * CHANNELS_PER_PAGE;
    const end = start + CHANNELS_PER_PAGE;
    const pageChannels = filteredChannels.slice(start, end);

    pageChannels.forEach(channel => {
        const channelDiv = document.createElement('div');
        channelDiv.classList.add('channel');
        channelDiv.innerHTML = `
            <img src="${channel.logo || 'path/to/default_logo.png'}" alt="${channel.name}" class="channel-logo" onclick="playStream('${encodeURIComponent(channel.url)}', '${encodeURIComponent(channel.name)}')">
            <p>${channel.name}</p>
        `;
        container.appendChild(channelDiv);
    });

    document.getElementById('page-info').textContent = `Page ${currentPage} of ${Math.ceil(filteredChannels.length / CHANNELS_PER_PAGE)}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = end >= filteredChannels.length;
}

// Handle search input
document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 1;
    displayChannels();
});

// Handle group selection
document.getElementById('group-select').addEventListener('change', (e) => {
    currentGroup = e.target.value;
    currentPage = 1;
    displayChannels();
});

// Pagination controls
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayChannels();
    }
});
document.getElementById('next-page').addEventListener('click', () => {
    if ((currentPage * CHANNELS_PER_PAGE) < channels.length) {
        currentPage++;
        displayChannels();
    }
});

// Play stream with proxy
function playStream(url, name) {
    const proxyUrl = `proxy.html?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`;
    window.location.href = proxyUrl;
}
