export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(200).json({
          reply:
            "আপনার free limit শেষ হয়ে গেছে। ৩০ মিনিট পর আবার চেষ্টা করুন। সাময়িক অসুবিধার জন্য দুঃখিত। 😞😞😞"
        });
      }

      return res.status(200).json({
        reply: `Gemini Error ${response.status}: ${
          data?.error?.message || JSON.stringify(data)
        }`
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      reply: reply || "Gemini কোনো উত্তর দেয়নি।"
    });

  } catch (error) {
    return res.status(200).json({
      reply: `Server Error: ${error.message}`
    });
  }
}
