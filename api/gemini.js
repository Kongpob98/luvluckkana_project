// Vercel Serverless Function - ปกป้อง API Key
// API Key จะเก็บใน Environment Variables ของ Vercel

export default async function handler(req, res) {
    const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
    const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.5-flash-lite,gemini-2.5-flash,gemini-2.0-flash')
        .split(',')
        .map((model) => model.trim())
        .filter(Boolean);
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

        const requestedModel = model || DEFAULT_MODEL;
        const modelQueue = [
            requestedModel,
            ...FALLBACK_MODELS.filter((fallbackModel) => fallbackModel !== requestedModel)
        ];

        const requestPayload = {
            contents: [{
                parts: [{
                    text: message
                }]
            }],
            generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 4096,
            }
        };

        const attempts = [];
        let finalResponse = null;
        let finalData = null;
        let usedModel = null;

        for (const currentModel of modelQueue) {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestPayload)
                }
            );

            let data = null;
            try {
                data = await response.json();
            } catch (parseError) {
                data = { error: { message: 'Invalid JSON response from Gemini API' } };
            }

            if (response.ok) {
                finalResponse = response;
                finalData = data;
                usedModel = currentModel;
                break;
            }

            attempts.push({
                model: currentModel,
                status: response.status,
                message: data?.error?.message || 'API request failed'
            });

            const isModelNotFound = response.status === 404;
            if (!isModelNotFound) {
                console.error('❌ Gemini API Error:', data);
                return res.status(response.status).json({
                    error: data?.error?.message || 'API request failed',
                    details: data,
                    attempts
                });
            }
        }

        if (!finalResponse || !finalData) {
            console.error('❌ Gemini API Error after fallback attempts:', attempts);
            return res.status(502).json({
                error: 'All configured Gemini models are unavailable',
                attempts
            });
        }

        if (usedModel !== requestedModel) {
            console.warn(`⚠️ Requested model \"${requestedModel}\" unavailable, fallback to \"${usedModel}\"`);
        }

        console.log('✅ Gemini response received');

        return res.status(200).json({
            ...finalData,
            modelRequested: requestedModel,
            modelUsed: usedModel
        });

    } catch (error) {
        console.error('❌ Server Error:', error);
        return res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
