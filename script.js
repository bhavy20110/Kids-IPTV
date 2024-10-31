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

            if (link) {
                const name = info.split(',')[1]?.trim() || 'Unknown Channel';

                const li = document.createElement('li');
                li.innerText = name;
                li.onclick = () => {
                    window.location.href = `player.html?url=${encodeURIComponent(link.trim())}&name=${encodeURIComponent(name)}`;
                };
                channelList.appendChild(li);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching M3U file:', error);
    });
