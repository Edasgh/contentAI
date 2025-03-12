"use server";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "../../convex/_generated/api";
import { client } from "@/lib/schematic";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import { getConvexClient } from "@/lib/convex";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getYtTranscript } from "./getYtTranscript";

const convexClient = getConvexClient();

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  systemInstruction:
    "You are a helpful youtube video creator assistant that creates high quality, SEO friendly, concise video titles",
});

const chat = model.startChat({});

export async function generateVideoSummary(videoId: string) {
  const model2 = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-001",
    systemInstruction:
      "You are a helpful youtube video summarizer that summarizes the given transcript",
  });

  const summarizeChat = model2.startChat({});

  console.log("Getting the transcript...");
  const { transcript } = await getYtTranscript(videoId);
  // Convert to a single text block
  const transcriptText = transcript.map((obj) => obj.text).join(" ");
  const result = await summarizeChat.sendMessage(
    `Summarize the given transcript : ${transcriptText}\n\n`
  );

  const summary = result.response.text();

  if (!summary) {
    return {
      error: "Failed to summarize video ",
    };
  }

  return { summary };
}

export async function titleGeneration(videoId: string, considerations: string) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("User not found!");
    }

    const { summary: videoSummary } = await generateVideoSummary(videoId);

    const result = await chat.sendMessage(
      `Please provide ONE concise YouTube title (and nothing else) for this video. Focus on the main points and key takeaways, it should be SEO friendly and 100 characters or less:\n\n${videoSummary}\n\n${considerations}. If considerations aren't given, generate a relevant title from the summary`
    );

    const title = result.response.text();

    if (!title) {
      return {
        error: "Failed to generate title (system error) ",
      };
    }

    await convexClient.mutation(api.titles.generate, {
      videoId,
      userId: user.id,
      title: title,
    });

    await client.track({
      event: featureFlagEvents[FeatureFlag.TITLE_GENERATIONS].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });
    console.log("Title generated :", title);
    return title;
  } catch (error) {
    console.error("Error generating title : ", error);
    throw new Error("Failed to generate title");
  }
}
