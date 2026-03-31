export default async function handler(req, res) {
  try {
    // 1. POSTメソッド以外は受け付けない
    if (req.method !== "POST") {
      return res.status(200).json({ message: "API is working. Please use POST." });
    }

    // 2. リクエストボディの取得
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body) {
      return res.status(400).json({ error: "No body provided" });
    }

    // 3. Google Gemini APIへのリクエスト
    // モデル名を -latest にし、パスの空白などを徹底排除しています
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 4. エラーハンドリングの強化（ここが重要！）
    if (!response.ok) {
      // VercelのログにGoogleからの生の回答を表示させる
      console.error("--- Google API Error Detail ---");
      console.error(JSON.stringify(data, null, 2));
      console.error("-------------------------------");
      
      // フロントエンドにもエラー状態を正しく伝える
      return res.status(response.status).json({
        error: "Google API returned an error",
        status: response.status,
        detail: data
      });
    }

    // 5. 成功時のレスポンス
    res.status(200).json(data);

  } catch (err) {
    console.error("Fatal Error in analyze.js:", err.message);
    res.status(500).json({
      error: "Analyze API crashed",
      message: err.message
    });
  }
}
