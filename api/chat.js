// Questo è il nuovo contenuto per /api/chat.js
// Usa la sintassi "module.exports" (CommonJS) per risolvere l'errore "Unexpected token 'export'"

module.exports = async (request, response) => {
    // Accetta solo richieste POST
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Metodo non consentito' });
    }

    // 1. Prende la chiave API segreta dalle Variabili d'Ambiente di Vercel
    const apiKey = process.env.GEMINI_API_KEY; 
    if (!apiKey) {
        console.error("ERRORE: Chiave API non trovata. Controlla la variabile GEMINI_API_KEY su Vercel.");
        return response.status(500).json({ error: 'Chiave API non configurata sul server' });
    }

    // 2. Definisce l'URL di Google (con il modello flash, come abbiamo corretto)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
        // 3. Inoltra l'intero payload ricevuto da index.html a Google
        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body), 
        });

        // 4. Legge la risposta da Google
        const data = await geminiResponse.json();

        // 5. Inoltra l'errore o la risposta corretta di nuovo al tuo index.html
        if (!geminiResponse.ok) {
            console.error("ERRORE DA GOOGLE:", data);
            return response.status(geminiResponse.status).json(data);
        }

        // Successo! Invia i dati al browser
        response.status(200).json(data);

    } catch (error) {
        console.error("ERRORE INTERNO AL SERVER /api/chat:", error.message);
        response.status(500).json({ error: 'Errore interno del server' });
    }
}
