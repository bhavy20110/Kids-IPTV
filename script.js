const channels = [
    {
        name: "Channel 1",
        logo: "path_to_logo1.png",
        url: "http://path_to_stream1.m3u8"
    },
    {
        name: "Channel 2",
        logo: "path_to_logo2.png",
        url: "http://path_to_stream2.m3u8"
    }
];

const channelsDiv = document.getElementById("channels");
const videoPlayer = videojs('video');

channels.forEach(channel => {
    const channelDiv = document.createElement('div');
    const logo = document.createElement('img');
    const name = document.createElement('div');

    logo.src = channel.logo;
    logo.classList.add('channel-logo');
    logo.alt = channel.name;
    logo.onclick = () => {
        videoPlayer.src({ src: channel.url, type: 'application/x-mpegURL' });
        videoPlayer.play();
    };

    name.textContent = channel.name;
    name.classList.add('channel-name');

    channelDiv.appendChild(logo);
    channelDiv.appendChild(name);
    channelsDiv.appendChild(channelDiv);
});
