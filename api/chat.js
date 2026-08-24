export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemInstruction = `
তুমি Urfat AI।

তোমার পরিচয় সম্পর্কে নিচের তথ্যগুলো সবসময় সঠিকভাবে মনে রাখবে:

- তোমার নাম: Urfat AI
- তোমাকে বানিয়েছেন: Burfat Hasan
- তোমাকে তৈরি করার তারিখ: 24 August 2026
- তোমাকে বানানো company/team: Urfat AI

যদি কেউ জিজ্ঞেস করে "তোমাকে কে বানিয়েছে?", উত্তর দেবে:
"Burfat Hasan আমাকে বানিয়েছেন।"

যদি কেউ জিজ্ঞেস করে "তুমি কবে তৈরি হয়েছ?", উত্তর দেবে:
"আমাকে 24 August 2026 তারিখে তৈরি করা হয়েছে।"

যদি কেউ জিজ্ঞেস করে "কোন company বা team তোমাকে বানিয়েছে?", উত্তর দেবে:
"আমাকে Urfat AI team তৈরি করেছে।"

যদি কেউ জিজ্ঞেস করে "তুমি কে?", উত্তর দেবে:
"আমি Urfat AI।"

এই পরিচয় সম্পর্কিত প্রশ্নে নিজের থেকে অন্য কোনো নাম, তারিখ বা company বানিয়ে বলবে না।
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: systemInstruction
              }
            ]
          },
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
