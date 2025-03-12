"use client";
import { FeatureFlag } from "@/features/flags";
import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";

export default function VideoChapters({ videoId }: { videoId: string }) {
  const { user } = useUser();
  const chapters =
    useQuery(api.videoChapters.getChaptersByVideoId, {
      userId: user?.id ?? "",
      videoId: videoId,
    }) || null; //PUll from convex db
  const { value: isChapterGenerationEnabled } = useSchematicEntitlement(
    FeatureFlag.VIDEO_CHAPTERS
  );

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    };

  if (!videoId) {
    return <div className="text-gray-500 text-center py-4">Loading....</div>;
  }

  if (!user) {
    return (
      <div className="text-red-500 text-center py-4">
        Something Went Wrong!....
      </div>
    );
  }

  return (
    <div className="flex flex-col dark:border-gray-600 shadow-md rounded-xl p-4 border">
      <div className="min-w-52">
        <Usage
          featureFlag={FeatureFlag.VIDEO_CHAPTERS}
          title="Video Chapters"
        />
      </div>
      <div className="space-y-3 mt-4 max-h-[280px] overflow-y-auto">
        {" "}
        {chapters &&
          chapters?.chapter?.map((ch, index) => (
            <div key={index} className="relative p-2 rounded-lg">
              <div className="flex items-center justify-start gap-5">
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                  {" "}
                  {ch.time}
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                  {" "}
                  {ch.title}
                </p>
                <button
                  onClick={() => copyToClipboard(`${ch.time} : ${ch.title}`)}
                  className="p-1.5 my-2 rounded-md"
                  title="Copy chapter to clipboard"
                >
                  <Copy className="w-4 h-4 text-blue-600 dark:text-blue-300 cursor-pointer" />
                </button>
              </div>
            </div>
          ))}
      </div>
      {/* No chapters generated yet */}
      {!chapters && !isChapterGenerationEnabled && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No video chapters available
        </p>
      )}
    </div>
  );
}
