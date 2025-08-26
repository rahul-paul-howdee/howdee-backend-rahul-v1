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
exports.HardCodeGoodMorningPrompt = async (userPrompt) => {
  const systemPrompt = `
You are a creative prompt enhancer for image generation models like Flux or Stable Diffusion.
Take the user’s basic prompt and expand it into a vivid, photorealistic Good Morning–themed portrait prompt in under 200 words.
Include details like:

Let the flux model detect the person in the selfie, so do not include the gender.

Portrait framing: head to knees, centered, ~80% height.

Subject standing on a lush green lawn, holding a cup, smiling warmly at the camera.

Background: flowering shrubs (bougainvillea, marigold, hibiscus), a garden bench slightly blurred, a couple of mid-height trees before the mountains, and two mountains with the sun rising in between. A few birds fly near the mountains to connect the mid-ground to the sky.

Morning sunlight with golden rays, vibrant daylight colors, photorealistic sharp focus on the subject, slight depth-of-field blur on background.

Text: “Good
Morning” placed at 20% from the bottom, horizontally centered. Use the DM Serif Display font, first-letter caps only, font size ~12–14% of image width, colour is a gradient fill from sunrise orange to golden yellow, with a glowing saffron outline for freshness and legibility.`;
  return systemPrompt;
};
//Good Night
exports.HardCodeGoodNightPrompt = async (userPrompt) => {
  const systemPrompt = `HardCodeGoodNightPrompt -
Create a photorealistic evening portrait from head to waist of the subject centred in a portrait frame. The subject is standing naturally against a dark night sky filled with stars, smiling warmly. In the background, a bright full moon is glowing above the subject’s shoulder, surrounded by a faint halo. Add the text “Good” on the first line and “Night” below it in the second line in the title case (only the first letter of each word is capitalized), in the DM Serif Display font, with a blue gradient color and a soft outer glow for high readability. The text is centered horizontally, and is at a height of ~15–20% from the bottom. Keep the overall atmosphere cinematic, simple, and serene. Use 85mm lens, f/2.8, shallow depth-of-field for realistic portrait effect.`;
  return systemPrompt;
};
//Ganesh Chaturthi
exports.HardCodeGaneshChaturthiPrompt = async (userPrompt) => {
  const systemPrompt = `Create a highly photorealistic festive portrait from head to knees, subject centered in frame. The subject stands tall with his hands doing a namaste pose. In the background, a larger than life sized idol of the Indian god Ganesha is beautifully decorated and placed on an ornate stage with fresh marigold and mango leaf garlands. The floor is covered with vibrant flower petals and colors. In the air, faint golden sparkles and thin incense smoke drift softly. Slightly blurred in the background, people in traditional attire play drums. Lighting is rich golden-orange, casting a divine glow, with the idol of Ganesha radiating softly as if lit from within. Use 85mm lens, f/2.8, shallow depth-of-field for realistic portrait effect. Add the text “HAPPY GANESH CHATURTHI” in bold modern IMPACT font, all caps, large size, saffron-orange text colour with a thick bright white outline, positioned 20% from the bottom and horizontally centered.`
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
