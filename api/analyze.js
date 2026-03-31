export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(200).json({ message: "Ready" });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // --- 【修正ポイント】ここを完全にコピーしてください ---
    // v1 ＋ gemini-1.5-flash の組み合わせが最も安定しています
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    // ---------------------------------------------------

    console.log("Calling Google API..."); // ログに「今から呼ぶよ」と表示

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
    res.status(500).json({ error: "API Crashed", details: err.message });
  }
}
