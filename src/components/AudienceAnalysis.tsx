"use client";
import { FeatureFlag } from "@/features/flags";
import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AudienceAnalysis({ videoId }: { videoId: string }) {
  const { user } = useUser();
  const comments = useQuery(api.comments.getCommentsByVideoId, {
    userId: user?.id ?? "",
    videoId: videoId,
  }); // TODO : PUll from convex db
  const { value: isAudienceAnalysisEnabled } = useSchematicEntitlement(
    FeatureFlag.AUDIENCE_ANALYSIS
  );

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
          featureFlag={FeatureFlag.AUDIENCE_ANALYSIS}
          title="Audience Analysis"
        />
      </div>

      {/* Show a success message for saved comments */}

      {comments?.comments?.length && isAudienceAnalysisEnabled && (
        <p className="py-2 text-green-400 mt-1 text-center">
          Comments Saved In DB
        </p>
      )}

      {/* No comments fetched yet */}

      {!comments?.comments?.length && !isAudienceAnalysisEnabled && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No analysis have been generated yet</p>{" "}
          <p className="text-sm text-gray-400 mt-1">
            Generate audience analysis to see it appear here
          </p>
        </div>
      )}
    </div>
  );
}
