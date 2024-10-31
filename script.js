// script.js
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const channelList = document.getElementById("channel-list");
    const m3uUrl = "M3UPlus-Playlist-20241019222427.m3u"; // Replace with the path to your M3U file if needed

    // Fetch the M3U playlist
    fetch(m3uUrl)
        .then(response => response.text())
        .then(data => {
            const channels = parseM3U(data);
            populateChannelList(channels);
        })
        .catch(error => {
            console.error("Error fetching the M3U playlist:", error);
        });

    // Parse the M3U playlist
    function parseM3U(data) {
        const lines = data.split("\n");
        const channels = [];
        let currentChannel = {};

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("#EXTINF:")) {
                // Extract channel name and duration
                const match = line.match(/#EXTINF:-1,(.*)/);
                if (match) {
                    currentChannel.name = match[1];
                }
            } else if (line && !line.startsWith("#")) {
                // It's a URL line
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = {}; // Reset for the next channel
            }
        }

        return channels;
    }

    // Populate the channel list
    function populateChannelList(channels) {
        channels.forEach((channel) => {
            const li = document.createElement("li");
            li.textContent = channel.name;
            li.addEventListener("click", () => playChannel(channel.url));
            channelList.appendChild(li);
        });
    }

    // Play the selected channel
    function playChannel(url) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            video.addEventListener("loadedmetadata", () => {
                video.play();
            });
        } else {
            console.error("This browser does not support HLS.");
        }
    }
});
