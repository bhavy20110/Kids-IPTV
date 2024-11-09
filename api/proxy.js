// api/proxy.js
const https = require('https');

export default function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        res.status(400).json({ error: 'Missing URL parameter' });
        return;
    }

    https.get(url, (response) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', response.headers['content-type']);

        response.pipe(res);
    }).on('error', (err) => {
        res.status(500).json({ error: 'Failed to fetch the stream' });
    });
}
