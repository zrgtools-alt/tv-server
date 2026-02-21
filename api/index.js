const axios = require('axios');

module.exports = async (req, res) => {
    const id = req.query.id || 'ary-news';

    // --- MADANI CHANNEL (Advanced Tapmad Scraper) ---
    if (id === 'madani-channel' || id === 'madani-tapmad') {
        try {
            const tapmadUrl = 'https://www.tapmad.com/watch/madani-channel/128881';
            
            const response = await axios.get(tapmadUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://www.tapmad.com/',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });

            // Tapmad ka naya JSON structure dhundna
            const html = response.data;
            
            // Regex 1: Direct M3U8 (Most Common)
            let regex = /"contentUrl":"(https?:\/\/[^"]+\.m3u8[^"]*)"/;
            let match = html.match(regex);

            // Regex 2: Agar pehla fail ho jaye (Fallback)
            if (!match) {
                regex = /https?:\\?\/\\?\/[^"']+\.m3u8[^"']*/;
                match = html.match(regex);
            }

            if (match && match[1]) {
                const streamUrl = match[1].replace(/\\\//g, '/');
                return res.redirect(streamUrl);
            } else if (match && match[0]) {
                const streamUrl = match[0].replace(/\\\//g, '/');
                return res.redirect(streamUrl);
            }
            
        } catch (e) {
            console.error("Tapmad Error:", e.message);
        }
        
        // Agar Tapmad fail ho jaye, to ye Backup Link chalayein
        return res.redirect('https://madani-live-01.pc.cdn.bitgravity.com/madani-live-01/live/feed01/playlist.m3u8');
    }

    // --- BAAKI CHANNELS (Same as before) ---
    const directLinks = {
        'ary-news': 'https://arynews.akamaized.net/hls/live/2027473/arynewshd/master.m3u8',
        'geo-news': 'https://geov2.akamaized.net/hls/live/2033900/geonewsv2/master.m3u8',
        'samaa-tv': 'https://samaatv-live.akamaized.net/hls/live/2034730/samaatv/master.m3u8',
        'ptv-sports': 'https://ptvsports-live.akamaized.net/hls/live/2034734/ptvsports/master.m3u8',
        'hum-news': 'https://humnews-live.akamaized.net/hls/live/2034731/humnews/master.m3u8',
        'express-news': 'https://expressnews-live.akamaized.net/hls/live/2034728/expressnews/master.m3u8'
    };

    if (directLinks[id]) {
        return res.redirect(directLinks[id]);
    }

    res.status(404).json({ error: "Channel not found" });
};
