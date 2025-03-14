"use client";
import { FeatureFlag } from "@/features/flags";
import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { Copy } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-toastify";

interface Title {
  _id: string;
  title: string;
}

const TitleGeneration = ({ videoId }: { videoId: string }) => {
  const { user } = useUser();
  const titles = useQuery(api.titles.list, {
    userId: user?.id ?? "",
    videoId: videoId,
  }); // TODO : PUll from convex db
  const { value: isTitleGenerationEnabled } = useSchematicEntitlement(
    FeatureFlag.TITLE_GENERATIONS
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
          featureFlag={FeatureFlag.TITLE_GENERATIONS}
          title="Title Generations"
        />
      </div>

      <div className="space-y-3 mt-4 max-h-[280px] overflow-y-auto">
        {" "}
        {titles?.map((title) => (
          <div
            key={title._id}
            className="group relative p-4 rounded-lg border border-gray-100 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 hover:border-blue-100 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                {" "}
                {title.title}
              </p>

              <button
                onClick={() => copyToClipboard(title.title)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5hover:bg-blue-100 rounded-md"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-blue-600 dark:text-blue-300 cursor-pointer" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No titles generated yet */}

      {!titles?.length && !isTitleGenerationEnabled && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No titles have been generated yet</p>{" "}
          <p className="text-sm text-gray-400 mt-1">
            Generate titles to see them appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default TitleGeneration;
