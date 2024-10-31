const m3uFileUrl = 'M3UPlus-Playlist-20241019222427.m3u';
const channelList = document.getElementById('channel-list');
const playerContainer = document.getElementById('player');

fetch(m3uFileUrl)
    .then(response => response.text())
    .then(data => {
        const channels = parseM3U(data);
        displayChannels(channels);
    })
    .catch(error => console.error('Error fetching M3U file:', error));

function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach(line => {
        if (line.startsWith('#EXTINF:')) {
            const parts = line.split(',');
            currentChannel = {
                name: parts[1].trim(),
                url: lines[lines.indexOf(line) + 1].trim(),
            };
            channels.push(currentChannel);
        }
        if (line.includes('tvg-logo')) {
            const logoUrl = line.match(/tvg-logo="([^"]+)"/);
            if (logoUrl) {
                currentChannel.logo = logoUrl[1];
            }
        }
    });
    return channels;
}

function displayChannels(channels) {
    channels.forEach(channel => {
        const channelDiv = document.createElement('div');
        channelDiv.classList.add('channel');
        
        const channelLogo = document.createElement('img');
        channelLogo.src = channel.logo || 'default-logo.png'; // Fallback logo
        channelLogo.alt = channel.name;
        
        channelDiv.appendChild(channelLogo);
        channelDiv.addEventListener('click', () => playChannel(channel.url));
        
        channelList.appendChild(channelDiv);
    });
}

function playChannel(url) {
    const player = new Clappr.Player({
        source: url,
        parentId: '#player',
        width: '100%',
        height: '100%',
        autoPlay: true,
    });
}
