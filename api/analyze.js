export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ message: "API is working." });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body) return res.status(400).json({ error: "No body provided" });

    const apiKey = process.env.GEMINI_API_KEY;

    // 🚨 APIキーが入っていない場合の安全装置を追加
    if (!apiKey) {
      console.error("Critical Error: GEMINI_API_KEY is not set in Vercel!");
      return res.status(500).json({ error: "Server configuration error: API Key missing." });
    }

    // ✅ v1beta と gemini-1.5-flash の組み合わせに戻します
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("--- Google API Error Detail ---");
      console.error(JSON.stringify(data, null, 2));
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);

  } catch (err) {
    console.error("Fatal Error:", err.message);
    res.status(500).json({ error: "Analyze API crashed", message: err.message });
  }
}
