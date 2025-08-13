const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20000
});

async function getEnhancedPrompt(systemPrompt, userPrompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Prompt Enhancement Failed:", error.message);
    throw new Error("Failed to enhance prompt with OpenAI");
  }
}

// 🎆 Diwali
exports.enhanceDiwaliPromptWithOpenAI = async (userPrompt) => {
  const systemPrompt = `
You are a creative prompt enhancer for image generation models like Flux or Stable Diffusion.
Take the user's basic prompt and expand it into a vivid, photorealistic Diwali-themed portrait prompt in under 150 words.
Include details like:
-let the flux model detect the person in the selfie donot include the gender
- Diwali celebration
- Pose, framing (Portrait image, head to mid-chest, centered, ~70% height.)
- Namaste pose, looking at camera.
- Diwali background: diyas, fairy lights, fireworks, rangoli, home/terrace.
-Realistic photo style, warm lighting, slight background blur.
- PUT A TEXT 'HAPPY DIWALI' AT 20% OF THE HEIGHT FROM BOTTOM AND HORIZONTALLY CENTRALLY ALIGNED.
- THE TEXT IS IN Bold rounded sans-serif typeface (similar to "TIMES NEW ROMAN"), all caps, SIZE 15, COLOUR - yellow fill with dark brown outline, cartoonish and festive look.
`;
  return getEnhancedPrompt(systemPrompt, userPrompt);
};


// 🎂 Birthday
exports.enhanceBirthdayPromptWithOpenAI = async (userPrompt) => {
  const systemPrompt = `
You are a creative prompt enhancer for image generation models like Flux or Stable Diffusion.
Take the user's basic prompt and expand it into a vivid, photorealistic Birthday-themed portrait prompt in under 150 words.
Include details like:
-let the flux model detect the person in the selfie so do not include the gender
- Birthday celebration
- Pose, framing (Portrait image, head to mid-chest, centered, ~70% height.)
- person holding a vanilla cake with 4 lit candles on it, looking at camera.
- Birthday background: balloons, lights, confetti, home interiors.
-Realistic photo style, warm lighting, slight background blur.
- PUT A TEXT 'HAPPY BIRTHDAY' AT 20% OF THE HEIGHT FROM BOTTOM AND HORIZONTALLY CENTRALLY ALIGNED.
- THE TEXT IS IN Bold MODERN typeface (similar to "IMPACT"), all caps, SIZE 15, COLOUR - WHITE WITH BLUE OUTLINE, FUN LOOK.
`;
  return getEnhancedPrompt(systemPrompt, userPrompt);
};

//  Independence Day
exports.hardCodeIndependencePrompt = async (userPrompt) => {
  const systemPrompt = `
Create a highly photorealistic Independence Day portrait from head to knees, subject centered in frame. The subject faces the camera directly with a perfect military salute: outer edge of right hand touching right temple, middle fingertip 1–2 cm above eyebrow, fingers straight and tightly together without gaps, thumb pressed flat against index finger, palm flat, wrist straight, pinky edge angled 10–15° downward, forearm at 30° upward, elbow slightly out, shoulder relaxed. Background: The Red Fort with a single large Indian flag fully unfurled, centered at the top. Above it, exactly three fighter jets in perfect parallel formation, leaving long, dense, perfectly parallel tricolor smoke trails (saffron, white, green) that stretch clearly across the sky. Lighting: bright midday sunlight, vibrant colors, natural skin tones, sharp focus on subject, slight depth-of-field blur on background. Add “HAPPY INDEPENDENCE DAY” in bold modern IMPACT font, all caps, large size, bright white with deep saffron outline, positioned 20% from the bottom and horizontally centered as one continuous block.
Use 85mm lens, f/2.8, shallow depth-of-field for realistic portrait effect.
`;
  return systemPrompt;
};

// ✨ Generic
exports.enhancePromptWithOpenAI = async (userPrompt) => {
  const systemPrompt = `
You are a creative prompt enhancer for image generation models like Flux or Stable Diffusion.
Take the user's basic prompt and turn it into a detailed, vivid, and realistic scene description suitable for high-quality portrait image generation.
Keep it under 150 words.
Avoid specifying gender or body types.
Use warm lighting, realistic environment, and soft background blur.
Focus on creating a visually aesthetic composition with a clean frame and good styling.`;
  return getEnhancedPrompt(systemPrompt, userPrompt);
};
