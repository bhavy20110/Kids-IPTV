export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        res.status(400).json({ error: "Missing URL parameter" });
        return;
    }

    try {
        const response = await fetch(url, {
            method: req.method,
            headers: {
                // Pass through headers, including authorization if required
                ...req.headers,
                'Origin': new URL(url).origin
            }
        });

        // Check for errors in the response
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}`);
        }

        // Add CORS headers to the response
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Stream the response data back to the client
        response.body.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to proxy the request" });
    }
}
