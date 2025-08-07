const Replicate = require("replicate");
const fetch = require("node-fetch");
const fs = require("fs/promises");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Swaps face from sourceImage into targetImage using Replicate.
 * @param {string} sourceImageUrl - The selfie image URL from Cloudinary
 * @param {string} targetImageUrl - The generated image URL from Replicate
 * @param {boolean} [saveToFile=false] - Whether to save the output image
 * @returns {Promise<string>} - Direct URL to the swapped image
 */
async function swapFace(sourceImageUrl, targetImageUrl, saveToFile = false) {
  try {
    const output = await replicate.run(
      "codeplugtech/face-swap:278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34",
      {
        input: {
          input_image: sourceImageUrl,
          swap_image: targetImageUrl,
        },
      }
    );

 

    let imageUrl;

    // Handle FileOutput object (Replicate's file output type)
    if (output && output.constructor && output.constructor.name === 'FileOutput') {
      console.log("📁 Processing FileOutput...");
      
      if (typeof output.url === 'function') {
        const urlResult = await output.url();
      
        // Convert URL object to string if needed
        imageUrl = urlResult instanceof URL ? urlResult.toString() : String(urlResult);
      } else if (output.url) {
        imageUrl = typeof output.url === 'string' ? output.url : String(output.url);
      } else {
        throw new Error("FileOutput object has no url property or method");
      }
    } else if (output && output.constructor && output.constructor.name === 'ReadableStream') {
      
      // Convert stream to string
      const reader = output.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
        result += decoder.decode(); // Final decode
        
        imageUrl = result.trim();
        
      } catch (streamError) {
        console.error("❌ Stream error:", streamError);
        throw streamError;
      }
    } else if (Array.isArray(output)) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else {
      // Fallback: try to extract URL from object
      imageUrl = output?.url || output?.output || String(output);
    }



    // Validate URL
    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error(`No valid URL extracted. Got: ${typeof imageUrl} - ${imageUrl}`);
    }

    if (!imageUrl.startsWith('http')) {
      throw new Error(`Invalid URL format: ${imageUrl}`);
    }

    // Optional: Save to local file
    if (saveToFile) {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        await fs.writeFile("face-swap-result.png", Buffer.from(buffer));
        console.log("✅ Saved to face-swap-result.png");
      } catch (saveError) {
        console.warn("⚠️ Failed to save file:", saveError.message);
      }
    }

    return imageUrl;
  } catch (error) {
    console.error("❌ Face swap error:", error.message);
    throw error;
  }
}

// Alternative approach: Use streaming with different handling
async function swapFaceStream(sourceImageUrl, targetImageUrl, saveToFile = false) {
  try {
    const prediction = await replicate.predictions.create({
      model: "codeplugtech/face-swap:278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34",
      input: {
        input_image: sourceImageUrl,
        swap_image: targetImageUrl,
      },
    });

    // Wait for completion
    const finalPrediction = await replicate.wait(prediction);
    
    console.log("🎯 Prediction Output:", finalPrediction.output);
    
    const imageUrl = Array.isArray(finalPrediction.output) 
      ? finalPrediction.output[0] 
      : finalPrediction.output;

    // Optional: Save to local file
    if (saveToFile && imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        await fs.writeFile("face-swap-result.png", Buffer.from(buffer));
      } catch (saveError) {
        console.warn("⚠️ Failed to save file:", saveError.message);
      }
    }

    return imageUrl;
  } catch (error) {
    console.error("❌ Face swap error:", error.message);
    throw error;
  }
}

module.exports = { swapFace, swapFaceStream };
