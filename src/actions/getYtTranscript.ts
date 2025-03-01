"use server";
import { currentUser } from "@clerk/nextjs/server";
import { Innertube } from "youtubei.js";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { client } from "@/lib/schematic";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export interface TranscriptEntry {
  text: string;
  timestamp: string;
}

const youtube = await Innertube.create({
  lang: "en",
  location: "IN",
  retrieve_player: false,
});

function formatTimestamp(start_ms: number): string {
  const minutes = Math.floor(start_ms / 60000);
  const seconds = Math.floor((start_ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const fetchTranscript = async (videoId: string): Promise<TranscriptEntry[]> => {
  try {
    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();
    const transcript: TranscriptEntry[] =
      transcriptData.transcript.content?.body?.initial_segments.map(
        (segment) => ({
          text: segment.snippet.text ?? "N/A",
          timestamp: formatTimestamp(Number(segment.start_ms)),
        })
      ) ?? [];
    //    console.log("transcript from fetchTranscript(main) : ", transcript);
    return transcript;
  } catch (error) {
    console.error("Error fetching transcript :", error);
    throw error;
  }
};

export async function getYtTranscript(videoId: string) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found!");
  }

  // TODO :  Check if transcript already exists in db [iF IT'S cached]
  const existingTranscript = await convex.query(
    api.transcripts.getTranscriptByVideoId,
    { videoId, userId: user.id }
  );

  if (existingTranscript) {
    console.log("Transcript found in db");
    return {
      transcript: existingTranscript.transcript,
      cache:
        "This video has already been transcribed - Accessing cached transcript instead of using a token",
    };
  }

  // If not fetch from youtube
  try {
    const transcript = await fetchTranscript(videoId);
    //  console.log("transcript from getYtTranscript : ",transcript)

    // Store transcript in database
    await convex.mutation(api.transcripts.storeTranscript, {
      videoId,
      userId: user.id,
      transcript,
    });

    await client.track({
      event: featureFlagEvents[FeatureFlag.TRANSCRIPTION].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });

    return {
      transcript,
      cache:
        "This video was transcribed using a token, the transcript is now saved in database",
    };
  } catch (error) {
    console.error("Error fetching transcript : ", error);
    return {
      transcript: [],
      cache: "Error fetching transcript. Please try again later",
    };
  }
  // Save to db

  // Return Transcript
}
