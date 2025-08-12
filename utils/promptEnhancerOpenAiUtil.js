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
exports.enhanceIndependencePromptWithOpenAI = async (userPrompt) => {
  const systemPrompt = `
You are a creative prompt enhancer for image generation models like Flux or Stable Diffusion.
Take the basic prompt of user and expand it into a vivid, photorealistic Independence Day themed portrait prompt in under 150 words.
Include details like:

Let the flux model detect the person in the selfie, so do not include the gender.

Independence Day Parade

Pose, framing: Portrait image, head to knees, centered, subject occupies ~80% of height.

Subject standing on Rajpath, with India Gate clearly visible in the background.

Subject is in Indian military right-hand salute position, right hand raised so that the thumb is touching the forehead, fingers straight and together, palm facing down, elbow slightly out, body upright, alert, facing forward.

Three fighter jets in the distant sky are flying parallel, leaving parallel smoke trails of orange, white, and green smoke from left to right

Realistic photo style, vibrant daylight colors, sharp focus on subject, slight depth-of-field blur on background.

PUT A TEXT "HAPPY INDEPENDENCE DAY" at 20% of the height from bottom, horizontally centered.

Text style: Bold modern typeface Impact, all caps, size 15, saffron coloured letters, patriotic look.

Strictly follow the above guidelines.
`;
  return getEnhancedPrompt(systemPrompt, userPrompt);
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
