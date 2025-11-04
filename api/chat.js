// Questo è il contenuto completo del file: /api/chat.js

export default async function handler(request, response) {
    // Accetta solo richieste POST
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Metodo non consentito' });
    }

    // 1. Prende la chiave API segreta dalle Variabili d'Ambiente di Vercel
    const apiKey = process.env.GEMINI_API_KEY; 
    if (!apiKey) {
        console.error("Chiave API non trovata nelle variabili d'ambiente.");
        return response.status(500).json({ error: 'Chiave API non configurata sul server' });
    }

    // 2. Definisce l'URL di Google (usando gemini-pro come nel tuo script)
    // NOTA: Il tuo script usa 'gemini-pro', quindi usiamo quello.
   const url = \https://www.google.com/search?q=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent%3Fkey%3D${apiKey}`;

    try {
        // 3. Inoltra l'intero payload ricevuto da index.html a Google
        // (request.body contiene già { contents, systemInstruction, ... })
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
            console.error("Errore da Google:", data);
            return response.status(geminiResponse.status).json(data);
        }

        response.status(200).json(data);

    } catch (error) {
        console.error("Errore nel server /api/chat:", error.message);
        response.status(500).json({ error: 'Errore interno del server' });
    }
}
