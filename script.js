fetch('M3UPlus-Playlist-20241019222427.m3u')
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
            const channelInfo = line.split(',');
            currentChannel = {
                name: channelInfo[1].trim(),
                logo: '',
                url: ''
            };
        } else if (line.startsWith('http')) {
            currentChannel.url = line.trim();
            channels.push(currentChannel);
        } else if (line.startsWith('logo=')) {
            currentChannel.logo = line.split('=')[1].trim();
        }
    });

    return channels;
}

function displayChannels(channels) {
    const channelListDiv = document.getElementById('channels');
    channels.forEach(channel => {
        const channelDiv = document.createElement('div');
        channelDiv.classList.add('channel');
        channelDiv.innerHTML = `
            <img src="${channel.logo || 'default-logo.png'}" alt="${channel.name}">
            <p>${channel.name}</p>
        `;
        channelDiv.onclick = () => {
            window.location.href = `player.html?url=${encodeURIComponent(channel.url)}&name=${encodeURIComponent(channel.name)}`;
        };
        channelListDiv.appendChild(channelDiv);
    });
}
