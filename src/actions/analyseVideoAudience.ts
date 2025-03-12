import { getConvexClient } from "@/lib/convex";
import { getVideoComments } from "./getVideoComments";
import { getVideoDetails } from "./getVideoDetails";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "../../convex/_generated/api";
import { client } from "@/lib/schematic";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const convexClient = getConvexClient();

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  systemInstruction:
    "You are a helpful youtube assistant. Your task is to determine the primary target audience from the given video details and to perform a sentiment analysis to assess the overall tone of audience reactions from the given comments. Categorize the sentiment into positive, neutral, and negative percentages. Finally, provide a detailed, insightful breakdown of both the target audience analysis and the overall sentiment analysis of the video",
});

const chat = model.startChat({});

export async function analyseAudience(videoId: string) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("User not found!");
    }

    //getting the video details
    const videoDetails = await getVideoDetails(videoId);
    //get the top 20 comments
    const comments = await getVideoComments(videoId);

    const result = await chat.sendMessage(
      `Please provide audience analysis for this video : ${videoId}.
        Determine the primary target audience from the video details : ${videoDetails}\n\n
         and \n\n
        Perform a sentiment analysis to assess the overall tone of audience reactions from the comments : ${comments?.comments}\n\n
        Categorize the sentiment into positive, neutral, and negative percentages. Finally, provide a detailed, insightful breakdown of both the target audience analysis and the overall sentiment analysis of the video 
        Format for notion`
    );

    const analysis = result.response.text();

    if (!analysis) {
      return {
        analysis:"",
        cache: "Failed to generate analysis (system error) ",
      };
    }

    await convexClient.mutation(api.audience_analysis.generate, {
      videoId,
      userId: user.id,
      analysis,
    });

    await client.track({
      event: featureFlagEvents[FeatureFlag.AUDIENCE_ANALYSIS].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });
    // console.log("Analysis generated :", analysis);
    return {
      analysis,
      cache: "This video was analysed using a token, now saved in database",
    };
  } catch (error) {
    console.log("Error while fetching analysis : ", error);
    return {
      analysis: "",
      cache: `Error fetching analysis : ${error}`,
    };
  }
}
