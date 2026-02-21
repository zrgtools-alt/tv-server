// TAPMAD SCRAPER (EXPERIMENTAL)
// Add this logic inside your existing Vercel script

if (id === 'ten-sports-tapmad') {
    const tapmadUrl = 'https://www.tapmad.com/play/ten-sports'; // URL check karein
    try {
        const response = await axios.get(tapmadUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.tapmad.com/'
            }
        });
        
        // Tapmad ka M3U8 Pattern
        const regex = /(https?:\/\/[^"]+\.m3u8[^"]*)/;
        const match = response.data.match(regex);
        
        if (match) {
            res.redirect(match[1]);
            return;
        }
    } catch (e) {
        console.log("Tapmad Error");
    }
}
