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
      <div className="space-y-3 mt-4 max-h-[280px] overflow-y-auto">
        {" "}
        {analyses?.map((an) => (
          <div
            key={an._id}
            className="group relative p-4 rounded-lg border border-gray-100 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 hover:border-blue-100 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                {" "}
                {an.analysis}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* No analysis generated yet */}
      {!analyses && !isAudienceAnalysisEnabled && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No Analysis available</p>{" "}
        </div>
      )}
    </div>
  );
}
