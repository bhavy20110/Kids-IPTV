async function loadChannels() {
    const response = await fetch('M3UPlus-Playlist-20241019222427.m3u');
    const data = await response.text();
    const lines = data.split('\n');

    const channelList = document.getElementById('channel-list');
    let currentChannel = {};

    lines.forEach(line => {
        if (line.startsWith('#EXTINF:')) {
            const channelInfo = line.split(',');
            currentChannel.name = channelInfo[1].trim();
        } else if (line.startsWith('http')) {
            currentChannel.url = line.trim();
            const logo = currentChannel.name.toLowerCase().replace(/ /g, '-') + '.png'; // Assuming logos are named consistently

            const channelItem = document.createElement('div');
            channelItem.className = 'channel-item';
            channelItem.innerHTML = `
                <img src="logos/${logo}" alt="${currentChannel.name} Logo" />
                <a href="player.html?url=${encodeURIComponent(currentChannel.url)}&name=${encodeURIComponent(currentChannel.name)}">${currentChannel.name}</a>
            `;
            channelList.appendChild(channelItem);
            currentChannel = {}; // Reset for next channel
        }
    });
}

loadChannels();
