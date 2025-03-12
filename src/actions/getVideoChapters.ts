import { currentUser } from "@clerk/nextjs/server";
import { getYtTranscript, TranscriptEntry } from "./getYtTranscript";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { client } from "@/lib/schematic";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  systemInstruction:
    "You are a helpful youtube video creator assistant that generates concise and engaging chapter titles based on the given transcript excerpt.",
});

const chat = model.startChat({});

// Define TypeScript interfaces
export interface ChunksEntry {
  start: string; // Changed to number for timestamp formatting
  text: string;
}

export interface ChaptersEntry {
  time: string;
  title: string;
}

//generate chunks of transcript
function chunkTranscript(
  transcript: TranscriptEntry[],
  maxWords = 250
): ChunksEntry[] {
  let chunks: ChunksEntry[] = [];
  let tempText = "";
  let startTime = "";

  transcript.forEach((entry, index) => {
    if (startTime === "") startTime = entry.timestamp;
    tempText += " " + entry.text;

    if (
      tempText.split(" ").length >= maxWords ||
      index === transcript.length - 1
    ) {
      if (startTime !== "") {
        chunks.push({ start: startTime, text: tempText.trim() });
      }
      tempText = "";
      startTime = "";
    }
  });

  return chunks;
}

export async function generateChapters(chunks: ChunksEntry[]) {
  const chapters: ChaptersEntry[] = [];

  for (const chunk of chunks) {
    const prompt = `You are an AI video content summarizer. Your task is to generate concise and engaging chapter titles based on the given transcript excerpt. Each chapter should represent a key topic or moment in the video. Ensure the chapter titles are:\n
    - Brief (max 7 words)\n
    - Descriptive\n
    - Engaging\n
    - Not overly generic\n\n
    Transcript Excerpt:\n
    "${chunk.text}"\n\n
    Generate ONLY ONE chapter title:`;

    try {
      const result = await chat.sendMessage(prompt);
      const summary = result.response.text();

      chapters.push({
        time: chunk.start,
        title: summary,
      });
    } catch (error) {
      console.error("Error generating chapter:", error);
    }
  }

  return chapters;
}

export async function getVideoChapters(videoId: string) {
  const user = await currentUser();
  // Check if transcript already exists in db [iF IT'S cached]
  const existingChapter = await convex.query(
    api.videoChapters.getChaptersByVideoId,
    { videoId, userId: user?.id ?? "" }
  );

  if (existingChapter) {
    console.log("Chapter found in db");
    return {
      transcript: existingChapter.chapter,
      cache:
        "This video's chapter has already been fetched - Accessing cached chapter instead of using a token",
    };
  }

  // If not fetch from gemini
  try {
    console.log("Getting the transcript...");
    const { transcript } = await getYtTranscript(videoId);
    console.log("Generating chunks...");
    const chunks: ChunksEntry[] = chunkTranscript(transcript);
    console.log("Generating chapters...");
    const chapters = await generateChapters(chunks);

    // Store chapters in database
    await convex.mutation(api.videoChapters.storeChapter, {
      videoId,
      userId: user?.id ?? "",
      chapter: chapters,
    });

    await client.track({
      event: featureFlagEvents[FeatureFlag.VIDEO_CHAPTERS].event,
      company: {
        id: user?.id ?? "",
      },
      user: {
        id: user?.id ?? "",
      },
    });

    return {
      chapters,
      cache:
        "This video's chapters were fetched using a token, the chapters are now saved in database",
    };
  } catch (error) {
    console.log("Error getting video chapters : ", error);
    return {
      chapters: [],
      cache: "Error getting video chapters. Please try again later.",
    };
  }
}
