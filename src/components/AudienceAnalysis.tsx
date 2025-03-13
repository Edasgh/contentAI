"use client";
import { FeatureFlag } from "@/features/flags";
import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSchematicEntitlement } from "@schematichq/schematic-react";

export default function AudienceAnalysis({ videoId }: { videoId: string }) {
  const { user } = useUser();

  const analyses =
    useQuery(api.audience_analysis.list, {
      userId: user?.id ?? "",
      videoId: videoId,
    }) || null; //  from convex db
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

      {/* No analysis generated yet */}
      {!analyses && !isAudienceAnalysisEnabled && (
        <p className="text-gray-500">No Analysis available</p>
      )}
    </div>
  );
}
