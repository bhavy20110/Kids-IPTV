// script.js
async function loadChannels() {
    try {
        const response = await fetch('M3UPlus-Playlist-20241019222427.m3u');
        if (!response.ok) throw new Error('Failed to load M3U file');
        
        const m3uText = await response.text();
        const channels = parseM3U(m3uText);
        
        const channelContainer = document.getElementById('channels');
        channelContainer.innerHTML = ""; // Clear previous content
        channels.forEach(channel => {
            const channelDiv = document.createElement('div');
            channelDiv.classList.add('channel');

            // Rounded logo
            const logo = document.createElement('img');
            logo.src = channel.logo;
            logo.alt = channel.name;
            logo.classList.add('logo');
            logo.style.borderRadius = "50%";
            
            // Channel name
            const name = document.createElement('span');
            name.innerText = channel.name;
            name.classList.add('channel-name');
            
            // Playable link
            channelDiv.addEventListener('click', () => {
                window.location.href = `player.html?url=${encodeURIComponent(channel.url)}&name=${encodeURIComponent(channel.name)}`;
            });
            
            channelDiv.appendChild(logo);
            channelDiv.appendChild(name);
            channelContainer.appendChild(channelDiv);
        });
    } catch (error) {
        console.error("Error loading channels:", error);
        alert("Error: Unable to load channels.");
    }
}

// Parse M3U data
function parseM3U(data) {
    const channels = [];
    const lines = data.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF:')) {
            const nameMatch = lines[i].match(/,(.*)$/);
            const logoMatch = lines[i].match(/tvg-logo="(.*?)"/);
            const name = nameMatch ? nameMatch[1].trim() : "Unknown Channel";
            const logo = logoMatch ? logoMatch[1] : "default-logo.png"; // Default logo fallback
            const url = lines[i + 1].trim();
            
            channels.push({ name, logo, url });
        }
    }
    return channels;
}

document.addEventListener('DOMContentLoaded', loadChannels);
