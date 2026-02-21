// Add this inside the main function
if (id === 'madani-tapmad') {
    try {
        const response = await axios.get('https://www.tapmad.com/watch/madani-channel/128881', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        // Naya Regex Pattern (Tapmad ne code change kiya hai)
        // Wo ab JSON ke andar chupa hota hai
        const regex = /"contentUrl":"(https?:\/\/[^"]+\.m3u8[^"]*)"/;
        const match = response.data.match(regex);

        if (match && match[1]) {
            return res.redirect(match[1].replace(/\\\//g, '/'));
        }
    } catch (e) {
        // Fail hone par backup link
        return res.redirect('https://madani-live-01.pc.cdn.bitgravity.com/madani-live-01/live/feed01/playlist.m3u8');
    }
}
