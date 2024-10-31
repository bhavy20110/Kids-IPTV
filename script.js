// script.js
async function loadChannels() {
    const response = await fetch('M3UPlus-Playlist.m3u');
    const m3uText = await response.text();
    const channels = parseM3U(m3uText);
    const channelContainer = document.getElementById('channels');
    channels.forEach(channel => {
        const channelElement = document.createElement('div');
        channelElement.classList.add('channel');
        channelElement.innerHTML = `
            <img src="${channel.logo}" class="channel-logo" alt="${channel.name}">
            <p>${channel.name}</p>
        `;
        channelElement.addEventListener('click', () => {
            window.location.href = `player.html?url=${encodeURIComponent(channel.url)}&name=${encodeURIComponent(channel.name)}`;
        });
        channelContainer.appendChild(channelElement);
    });
}

function parseM3U(m3uText) {
    const channelRegex = /#EXTINF:.*tvg-logo="(.*)",(.*)\n(.*)/g;
    const channels = [];
    let match;
    while ((match = channelRegex.exec(m3uText)) !== null) {
        channels.push({ logo: match[1], name: match[2], url: match[3] });
    }
    return channels;
}

loadChannels();
