export default async function handler(req, res) {
  try {
    // 👉 GETのときは早期return（これ重要）
    if (req.method !== "POST") {
      return res.status(200).json({ message: "API is working" });
    }

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    if (!body) {
      return res.status(400).json({ error: "No body provided" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message,
      detail: "analyze API crashed"
    });
  }
}
