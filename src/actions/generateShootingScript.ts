"use server";

import { generateVideoSummary } from "./titleGeneration";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  systemInstruction:
    "You are a helpful youtube video creator assistant that ONLY creates a step by step youtube video shooting script from the given video summary.",
});

export async function generateShootingScript(videoId: string) {
  try {
    //get the video summary
    const { summary: videoSummary } = await generateVideoSummary(videoId);

    if (!videoSummary) {
      return {
        error: "Failed to generate shooting script (system error) ",
      };
    }

    const chat = model.startChat({});

    //getting suggestions
    const result = await chat.sendMessage(
      `Generate a step by step shooting script from the given video summary : ${videoSummary}\n\n
       so, that I can use on my own channel to produce a video that is similar to this one, don't do any other steps such as generating an image, just generate the script only!`
    );

    const shooting_script = result.response.text();

    if (!shooting_script) {
      return {
        error: "Failed to generate shooting script (system error) ",
      };
    }

    return { shooting_script };
  } catch (error) {
    console.log("Error getting shooting script : ", error);
    return {
      shooting_script: "",
      error: "Error occurred while getting shooting script, try again",
    };
  }
}
