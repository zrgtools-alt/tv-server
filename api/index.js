const axios = require('axios');

module.exports = async (req, res) => {
    const id = req.query.id || 'ary-news';

    // 1. DIRECT PERMANENT LINKS (Sabse Fast)
    const directLinks = {
        'ary-news': 'https://arynews.akamaized.net/hls/live/2027473/arynewshd/master.m3u8',
        'geo-news': 'https://geov2.akamaized.net/hls/live/2033900/geonewsv2/master.m3u8',
        'samaa-tv': 'https://samaatv-live.akamaized.net/hls/live/2034730/samaatv/master.m3u8',
        'express-news': 'https://expressnews-live.akamaized.net/hls/live/2034728/expressnews/master.m3u8',
        'hum-news': 'https://humnews-live.akamaized.net/hls/live/2034731/humnews/master.m3u8',
        'gnn-hd': 'https://gnnhd-live.akamaized.net/hls/live/2034729/gnnhd/master.m3u8',
        'ptv-news': 'https://ptvnews-live.akamaized.net/hls/live/2034732/ptvnews/master.m3u8',
        'ptv-sports': 'https://ptvsports-live.akamaized.net/hls/live/2034734/ptvsports/master.m3u8',
        'madani-channel': 'https://streaming.madani.co/madani/playlist.m3u8' // Official Link (Better than Tapmad)
    };

    // Agar direct link list mein hai, to wahi chala do
    if (directLinks[id]) {
        return res.redirect(directLinks[id]);
    }

    // 2. TAPMAD SCRAPER (Agar Madani Channel Tapmad se hi chahiye)
    if (id === 'tapmad-madani') {
        const targetUrl = 'https://www.tapmad.com/watch/madani-channel/128881';
        try {
            const response = await axios.get(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://www.tapmad.com/'
                }
            });

            // Tapmad ke page me m3u8 dhundo
            const regex = /(https?:\/\/[^"]+\.m3u8[^"]*)/;
            const match = response.data.match(regex);

            if (match && match[1]) {
                const cleanUrl = match[1].replace(/\\\//g, '/');
                return res.redirect(cleanUrl);
            }
        } catch (error) {
            console.error("Tapmad Error:", error.message);
            // Agar Tapmad fail ho, to Official link par bhej do
            return res.redirect(directLinks['madani-channel']);
        }
    }

    // 3. Agar kuch na mile
    return res.status(404).json({
        error: "Channel not found",
        available_ids: Object.keys(directLinks)
    });
};
