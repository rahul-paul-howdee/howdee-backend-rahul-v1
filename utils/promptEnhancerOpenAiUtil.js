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
Create a highly photorealistic Independence Day portrait from head to knees, subject centered in frame. The subject faces the camera directly with a perfect military salute: outer edge of right hand touching right temple, middle fingertip 1–2 cm above eyebrow, fingers straight and tightly together without gaps, thumb pressed flat against index finger, palm flat, wrist straight, pinky edge angled 10–15° downward, forearm at 30° upward, elbow slightly out, shoulder relaxed. Background: A wide angle shot of 'The Red Fort' with a realistic looking small-sized Indian flag fully unfurled, centered at the top. Above it, in the distant sky, exactly three fighter jets fly in perfect parallel formation, leaving long, dense, perfectly parallel smoke trails of color - orange, white, green. Lighting: bright midday sunlight, vibrant colors, natural skin tones, sharp focus on subject, slight depth-of-field blur on background. Add “HAPPY INDEPENDENCE DAY” in bold modern IMPACT font, all caps, large size, bright white with deep saffron outline, positioned 20% from the bottom and horizontally centered as one continuous block.
Use 85mm lens, f/2.8, shallow depth-of-field for realistic portrait effect.
`;
  return systemPrompt;
};

//Good Morning
exports.enhanceGoodMorningPromptWithOpenAI = async (userPrompt) => {
  const systemPrompt = `
A photorealistic morning portrait in golden sunrise light, framed head to waist, with the subject standing naturally in a lush flower garden against distant hills, 
holding a white coffee mug and smiling warmly, with a clearly visible bright sun rising prominently in the gap between two mountains and soft mist glowing around it as birds fly across the sky; 
overlay the text “Good” on the first line and “Morning” on the second line in title case (only the first letter of each word capitalized), centered horizontally at the bottom of the image, using DM Serif Display font at ~15–20% of the image height, 
with an orange gradient color and a soft outer glow for readability, ensuring the text does not cover the subject’s face and keeping the overall atmosphere cinematic, clean, vibrant, and uplifting.
';
  return systemPrompt;
};
//Good Night
exports.enhanceGoodNightPromptWithOpenAI = async (userPrompt) => {
  const systemPrompt = `You are a creative prompt enhancer for image generation models like Flux or Stable Diffusion.
Take the user’s basic prompt and expand it into a vivid, photorealistic Good Night–themed portrait prompt in under 100 words.

Include details like:

Portrait framing: head to knees, centered, ~80% height.

Subject standing normally on a terrace with a calm smile, softly lit by moonlight.

Background: deep starry night sky with a bright full moon, a few scattered clouds, and faint silhouettes of trees below. Subtle twinkling stars add depth.

Cool bluish tones with gentle highlights on the face from moonlight, photorealistic sharp focus on subject, slight depth-of-field blur on background.

Text: “Good Night” placed at 20% from the bottom, horizontally centered. Use DM Serif Display font, first-letter caps only, size ~12–14% of image width, in glowing white with a soft silver-blue outline for radiance.`;
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

