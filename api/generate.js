export default async function handler(req, res) {
  try {
    // body安全取得
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const { prompt, ratio } = body;

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
            aspectRatio: ratio,
          },
        }),
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message,
      detail: "generate API crashed"
    });
  }
}
