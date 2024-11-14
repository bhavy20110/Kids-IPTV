<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playing Channels</title>
    <link rel="stylesheet" href="https://vjs.zencdn.net/7.21.1/video-js.css">
    <style>
        body {
            background-color: #121212;
            color: white;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        #videoContainer {
            max-width: 800px;
            width: 100%;
            text-align: center;
            padding: 20px;
        }
        h1, h2 {
            color: #ffffff;
        }
        .pagination-controls {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 600px;
            margin-top: 20px;
        }
        .pagination-controls button {
            padding: 10px;
            font-size: 16px;
            color: #fff;
            background-color: #333;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .pagination-controls button:disabled {
            background-color: #666;
            cursor: not-allowed;
        }
        .channel-list {
            list-style: none;
            padding: 0;
            text-align: left;
            margin-top: 20px;
        }
        .channel-list li {
            padding: 10px;
            background-color: #333;
            margin-bottom: 5px;
            cursor: pointer;
            border-radius: 5px;
        }
        #debug-log {
            display: none;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div id="videoContainer">
        <h1 id="channel-name">Channel Player</h1>
        <video id="video" class="video-js vjs-default-skin" controls crossorigin="anonymous" playsinline style="width: 100%;"></video>
        <ul id="channel-list" class="channel-list"></ul>
        <div class="pagination-controls">
            <button id="prevPage" onclick="changePage(-1)">Previous</button>
            <span id="pageIndicator"></span>
            <button id="nextPage" onclick="changePage(1)">Next</button>
        </div>
        <div id="debug-log"></div>
        <div class="error-message" id="error-message"></div>
    </div>

    <!-- Video.js and streaming libraries -->
    <script src="https://vjs.zencdn.net/7.21.1/video.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script src="https://cdn.dashjs.org/latest/dash.all.min.js"></script>

    <script>
        const channels = [
            { name: "Channel 1", url: "stream1.m3u8" },
            { name: "Channel 2", url: "stream2.m3u8" },
            { name: "Channel 3", url: "stream3.m3u8" },
            // Add up to as many channels as you need for testing pagination
            { name: "Channel 60", url: "stream60.m3u8" }
        ];

        const itemsPerPage = 20;
        let currentPage = 1;
        const totalPages = Math.ceil(channels.length / itemsPerPage);
        
        const player = videojs("video", {
            autoplay: true,
            controls: true,
            preload: "auto",
            fluid: true
        });

        function displayChannels(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const currentChannels = channels.slice(start, end);
            
            const channelList = document.getElementById("channel-list");
            channelList.innerHTML = "";
            currentChannels.forEach(channel => {
                const listItem = document.createElement("li");
                listItem.textContent = channel.name;
                listItem.onclick = () => loadChannel(channel);
                channelList.appendChild(listItem);
            });

            document.getElementById("pageIndicator").textContent = `Page ${page} of ${totalPages}`;
            document.getElementById("prevPage").disabled = (page === 1);
            document.getElementById("nextPage").disabled = (page === totalPages);
        }

        function loadChannel(channel) {
            const { name, url } = channel;
            document.getElementById("channel-name").innerText = name;
            const video = document.getElementById("video");

            if (Hls.isSupported() && url.endsWith(".m3u8")) {
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
            } else if (url.endsWith(".mpd")) {
                const dashPlayer = dashjs.MediaPlayer().create();
                dashPlayer.initialize(video, url, true);
            } else {
                player.src({ src: url, type: "video/mp4" });
            }
        }

        function changePage(direction) {
            currentPage += direction;
            displayChannels(currentPage);
        }

        // Display the first page of channels on load
        displayChannels(currentPage);

        // Key combination to toggle debug logs
        let debugVisible = false;
        document.addEventListener("keydown", (event) => {
            if (event.key === "E" && event.shiftKey && event.altKey) {
                debugVisible = !debugVisible;
                const logContainer = document.getElementById("debug-log");
                logContainer.style.display = debugVisible ? "block" : "none";
            }
        });
    </script>
</body>
</html>
