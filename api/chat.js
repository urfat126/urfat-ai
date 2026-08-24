export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        reply: `OpenAI Error ${response.status}: ${
          data?.error?.message || JSON.stringify(data)
        }`
      });
    }

    return res.status(200).json({
      reply: data.output_text || "OpenAI কোনো text উত্তর দেয়নি।"
    });

  } catch (error) {
    return res.status(200).json({
      reply: `Server Error: ${error.message}`
    });
  }
}
