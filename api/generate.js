export default async function handler(req, res) {
  try {
    // ✅ GET対策（ブラウザ直接アクセスでも落ちない）
    if (req.method !== "POST") {
      return res.status(200).json({ message: "API is working" });
    }

    // ✅ body安全取得
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    if (!body) {
      return res.status(400).json({ error: "No body provided" });
    }

    const { prompt, ratio } = body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ✅ Imagen API 呼び出し
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt,
            },
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: ratio || "1:1", // デフォルト安全値
          },
        }),
      }
    );

    // ✅ APIエラー検知（これ重要）
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "Imagen API error",
        detail: text,
      });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      detail: "generate API crashed"
    });
  }
}
