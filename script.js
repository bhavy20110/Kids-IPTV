fetch('M3UPlus-Playlist-20241019222427.m3u')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        const channels = data.split('#EXTINF:');
        const channelList = document.getElementById('channel-list');

        channels.forEach((channel, index) => {
            if (index === 0) return; // Skip the first element

            const lines = channel.split('\n');
            const info = lines[0];
            const link = lines[1];
            const logoUrl = info.match(/logo="([^"]+)"/)?.[1]; // Extract logo URL

            if (link) {
                const name = info.split(',')[1]?.trim() || 'Unknown Channel';

                const li = document.createElement('li');
                li.innerHTML = `
                    <img src="${logoUrl || 'default-logo.png'}" alt="${name} Logo" class="channel-logo">
                    <a href="player.html?url=${encodeURIComponent(link)}&name=${encodeURIComponent(name)}">
                        ${name}
                    </a>
                `;
                channelList.appendChild(li);
            }
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
