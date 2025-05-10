"use client";
import { getVideoDetails } from "@/actions/getVideoDetails";
import { VideoDetails } from "@/types/types";
import { Calendar, Eye, MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const YoutubeVideoDetails = ({ videoId }: { videoId: string }) => {
  const [video, setVideo] = useState<VideoDetails>();
  const [isError, setIsError] = useState(false);

  //   console.log(videoId);

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

  if (isError || !videoId) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="@container bg-white dark:bg-gray-800 rounded-xl">
      <div className="flex flex-col gap-8">
        {" "}
        {/* Video Thumbnail */}
        {video ? (
          <>
            <div className="flex-shrink-0">
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={500}
                height={500}
                className="w-full rounded-xl shadow-md hover:shadow-xl dark:hover:shadow-2xl transition-shadow duration-300"
              />
            </div>
            {/* Video details */}
            <div className="flex-grow space-y-4">
              <h1 className="text-2xl @lg:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
                {video.title}
              </h1>{" "}
            </div>
            {/* Channel info */}
            <div className="flex items-center gap-4">
              <Image
                src={video.channel.thumbnail}
                alt={video.channel.title}
                width={48}
                height={48}
                className="w-10 h-10 @md:w-12 @md:h-12 rounded-full border-2 border-gray-100"
              />
              <div>
                <p className="text-base @md:text-lg font-semibold text-gray-900 dark:text-gray-300">
                  {video.channel.title}
                </p>
                <p className="text-sm @md:text-base text-gray-600 dark:text-gray-400">
                  {video.channel.subscribers} Subscribers
                </p>
              </div>
            </div>
            {/* Video stats */}
            <div className="grid grid-cols-2 @lg:grid-cols-4 gap-4 pt-4">
              {/* Publish Date */}
              <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-50" />
                  <p className="text-sm text-gray-600  dark:text-gray-300">
                    Published
                  </p>
                </div>
                <p className="font-medium text-sm md:text-lg text-gray-900 dark:text-gray-400">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>
              </div>
              {/* Video views */}
              <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-gray-600 dark:text-gray-50" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Views
                  </p>
                </div>
                <p className="font-medium text-sm md:text-lg text-gray-900 dark:text-gray-400">
                  {video.views}
                </p>
              </div>
              {/* Video Likes */}
              <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2 mb-1">
                  <ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-50" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Likes
                  </p>
                </div>
                <p className="font-medium text-sm md:text-lg text-gray-900 dark:text-gray-400">
                  {video.likes}
                </p>
              </div>
              {/* Video comments */}
              <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-50" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Comments
                  </p>
                </div>
                <p className="font-medium text-sm md:text-lg text-gray-900 dark:text-gray-400">
                  {video.comments}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center p-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeVideoDetails;
