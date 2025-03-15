"use client";
import AIAgentChat from "@/components/AIAgentChat";
import ThumbnailGeneration from "@/components/ThumbnailGeneration";
import TitleGeneration from "@/components/TitleGeneration";
import Transcription from "@/components/Transcription";
import Usage from "@/components/Usage";
import YoutubeVideoDetails from "@/components/youtubeVideoDetails";
import { FeatureFlag } from "@/features/flags";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { createOrGetVideo } from "@/actions/createOrGetVideo";
import { toast } from "react-toastify";
import AudienceAnalysis from "@/components/AudienceAnalysis";
import VideoChapters from "@/components/VideoChapters";
import BlogGeneration from "@/components/BlogGeneration";

export default function VideoAnalysis() {
  const params = useParams<{ videoId: string }>();
  const { videoId } = params;
  const [video, setVideo] = useState<Doc<"videos"> | null | undefined>(
    undefined
  );
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;
    const fetchVideo = async () => {
      const response = await createOrGetVideo(videoId as string, user.id);
      if (!response.success) {
        toast.error("Something went Wrong!");
        console.log("error creating or getting video", response.error);
      } else {
        setVideo(response.data);
      }
    };

    fetchVideo();
  }, [videoId, user]);

  const videoTranscriptionStatus =
    video === undefined ? (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Loading...
        </span>
      </div>
    ) : !video ? (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full">
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        <p className="text-sm text-amber-700 dark:text-amber-400">
          This is your first time analysing this video <br />
          <span className="font-semibold">
            (1 analysis token is being used!)
          </span>
        </p>
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <p className="text-sm text-green-700 dark:text-green-400">
          Analysis exists for this video - no additional tokens needed in future
          calls! <br />
        </p>
      </div>
    );

  return (
    <div className="xl:container bg-white dark:bg-gray-800 mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left side */}

        <div className="order-2 lg:order-1 flex flex-col gap-4 bg-white dark:bg-gray-800 lg:border-r border-gray-200 dark:border-gray-500 p-6">
          {/* Analysis section */}
          <div className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-500 shadow-md rounded-xl">
            <Usage
              featureFlag={FeatureFlag.ANALYSE_VIDEO}
              title="Analyse Video"
            />
            {/* Video Transcription Status */}
            {videoTranscriptionStatus}
          </div>
          {/* Youtube video details */}
          <YoutubeVideoDetails videoId={videoId} />
          {/* Audience Analysis */}
          <AudienceAnalysis videoId={videoId} />
          {/* Thumbnail Generation */}
          <ThumbnailGeneration videoId={videoId} />
          {/* Title Generation */}
          <TitleGeneration videoId={videoId} />
          {/* Blog Post Generations */}
          <BlogGeneration videoId={videoId} />
          {/* Transcription */}
          <Transcription videoId={videoId} />
          {/* Video Chapters */}
          <VideoChapters videoId={videoId} />
        </div>

        {/* Right Side */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-20 h-[500px] md:h-[calc(100vh-6rem)]">
          {/* Ai Agent Chat Section */}
          {/* <p>Chat</p> */}
          <AIAgentChat videoId={videoId} />
        </div>
      </div>
    </div>
  );
}
