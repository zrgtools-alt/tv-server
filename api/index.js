const app = require('express')();
const axios = require('axios');

app.get('/', async (req, res) => {
    // Channel ID URL se lein
    const channelId = req.query.id || 'tamasha-life-hd';
    const targetUrl = `https://tamashaweb.com/live-tv/${channelId}`;

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                // Headers very important hain taaki Tamasha ko lage ye real browser hai
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://tamashaweb.com/',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        const html = response.data;

        // NEW POWERFUL REGEX: Ye JSON format aur Normal format dono dhundega
        // Pattern: Find http(s)://.....m3u8....wmsAuthSign=...
        const regex = /https?:\\?\/\\?\/[^"'\s]+\.m3u8[^"'\s]*wmsAuthSign=[^"'\s]*/g;
        
        const matches = html.match(regex);

        if (matches && matches.length > 0) {
            // Sabse lamba link usually best hota hai (Chunks vs Master playlist)
            // Slashes ko fix karein (https:\/\/ -> https://)
            let streamUrl = matches[0].replace(/\\\//g, '/');
            
            // User ko redirect karein
            res.redirect(streamUrl);
        } else {
            // Agar link na mile to error print karein
            console.error("Regex match failed for ID:", channelId);
            res.status(404).json({ 
                error: 'Stream link not found.', 
                details: 'Tamasha structure might have changed or Geo-block active.',
                channel: channelId
            });
        }

    } catch (error) {
        console.error("Axios Error:", error.message);
        res.status(500).send('Server Error: ' + error.message);
    }
});

module.exports = app;
