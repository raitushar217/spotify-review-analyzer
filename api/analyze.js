// /api/analyze.js — Vercel Serverless Function
// Receives combined items array and returns structured answers to 6 research questions
// Uses Groq LLM (llama-3.1-8b-instant) for analysis

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const { items, appstoreCount, redditCount } = req.body;

  // Truncate and format for the prompt
  const reviewText = items.map(r =>
    `[${r.source.toUpperCase()} | Rating: ${r.rating}] ` +
    `${(r.content || r.title || '').slice(0, 280)}`
  ).join('\n---\n');

  const systemPrompt = `You are a music product researcher analyzing real Spotify user reviews and Reddit posts. Your task is to answer 6 specific research questions about music discovery barriers.
Return ONLY valid JSON. No markdown fences. No extra text. No explanation. Only the raw JSON object.`;

  const userPrompt = `Analyze these ${items.length} Spotify user feedback items (${appstoreCount} App Store reviews + ${redditCount} Reddit posts) and return this exact JSON:

{
  "total_analyzed": ${items.length},
  "sources": { "appstore": ${appstoreCount}, "reddit": ${redditCount} },

  "q1_why_struggle_to_discover": [
    { "reason": "", "evidence": "", "count": 0 }
  ],

  "q2_recommendation_frustrations": [
    { "frustration": "", "count": 0, "severity": "high|medium|low", "example": "" }
  ],

  "q3_listening_behaviors": [
    { "behavior": "", "description": "", "frequency": "common|occasional|rare" }
  ],

  "q4_repeat_listening_causes": [
    { "cause": "", "frequency": "high|medium|low", "evidence": "" }
  ],

  "q5_user_segments": [
    { "segment": "", "discovery_challenge": "", "evidence": "" }
  ],

  "q6_unmet_needs": [
    { "need": "", "mention_count": 0, "example_quote": "" }
  ],

  "key_insight": "",
  "surprising_insight": "",
  "scale_note": "Analyzed ${appstoreCount} App Store reviews + ${redditCount} Reddit posts live. Full 300+ review batch in Make.com research sheet."
}

Reviews to analyze:
${reviewText}`;

  // Call Groq API
  async function callGroq() {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          response_format: { type: "json_object" },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 3500
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status} from Groq`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error(data.error?.message || "No completions returned from Groq");
    }

    const raw = data.choices[0].message?.content || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }

  try {
    let result;
    try {
      result = await callGroq();
    } catch (firstErr) {
      // Retry once on parse failure
      result = await callGroq();
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'AI analysis failed: ' + err.message });
  }
}
