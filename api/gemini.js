// Vercel Serverless Function - ปกป้อง API Key
// API Key จะเก็บใน Environment Variables ของ Vercel

export default async function handler(req, res) {
    const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    // ตั้งค่า CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, model = DEFAULT_MODEL } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // API Key จาก Environment Variable (ตั้งใน Vercel Dashboard)
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY not found in environment variables');
            return res.status(500).json({ 
                error: 'API key not configured',
                hint: 'Please add GEMINI_API_KEY to Vercel Environment Variables'
            });
        }

        console.log('✅ API Key found, calling Gemini...');

        // เรียก Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Gemini API Error:', data);
            return res.status(response.status).json({ 
                error: data.error?.message || 'API request failed',
                details: data
            });
        }

        console.log('✅ Gemini response received');

        // ส่งกลับไปให้ Frontend
        return res.status(200).json(data);

    } catch (error) {
        console.error('❌ Server Error:', error);
        return res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
