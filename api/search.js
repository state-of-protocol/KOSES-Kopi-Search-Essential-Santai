// api/search.js
export default async function handler(req, res) {
    // 1. Ambil input dari frontend (panggilan fetch)
    const { query } = req.query;
    
    // 2. Ambil API KEY dari Environment Variable (Set di Vercel Dashboard)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        // 3. Berhubung dengan Google AI Studio secara rahsia
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Berikan maklumat ringkas, tepat, dan terkini tentang: ${query}. Gunakan nada profesional, teknikal, dan gaya cyberpunk.` }]
                }]
            })
        });

        const data = await response.json();
        
        // 4. Hantar hasil semula ke laman web anda
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
