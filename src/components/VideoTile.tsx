"use client";
import { getVideoDetails } from "@/actions/getVideoDetails";
import { VideoDetails } from "@/types/types";
import { Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Timeago from "react-timeago";

export default function VideoTile({
  videoId,
  createdAt,
}: {
  videoId: string;
  createdAt: number;
}) {
  const [video, setVideo] = useState<VideoDetails>();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const videoDetails = await getVideoDetails(videoId);
      //   console.log("video details",videoDetails);
      if (!videoDetails) {
        console.log("video not found!");
        setIsError(true);
        return;
      }
      setVideo(videoDetails);
    };
    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  if (isError || !video) {
    return (
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/analysis/video/${videoId}`}
      >
        <div className="p-5 border border-gray-300 dark:border-gray-600 rounded-xl">
          <div className="flex flex-wrap justify-between items-start">
            <div className="flex gap-3 items-center">
              <Video />
              <div className="flex gap-2 flex-col justify-start items-start">
                <span className="w-md rounded-xl h-3 bg-gray-300 dark:bg-gray-600 animate-pulse" />
                <span className="w-sm h-2 rounded-md bg-slate-500 dark:bg-slate-400 animate-pulse" />
                <span className="w-[5rem] h-2 rounded-md bg-slate-700 dark:bg-slate-200 animate-pulse" />
              </div>
            </div>
            <div className="w-[152px] h-[96px] text-center rounded-md bg-slate-500 dark:bg-slate-400 animate-pulse text-white">
              <span className="mx-auto text-center">{videoId}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/analysis/video/${videoId}`}
    >
      <div className="p-5 border border-gray-300 dark:border-gray-600 rounded-xl">
        <div className="flex flex-wrap gap-3 justify-between items-start">
          <div className="flex gap-3 items-center">
            <Video />
            <div className="flex gap-2 flex-col justify-start items-start">
              <p className="font-semibold tracking-tight text-base">
                {video?.title}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {video?.channel?.title}
              </p>
              <p className="text-xs">
                <Timeago date={createdAt} />
              </p>
            </div>
          </div>
          <Image
            src={video?.thumbnail ?? ""}
            width={152}
            height={96}
            alt={video?.title ?? ""}
          />
        </div>
      </div>
    </Link>
  );
}
