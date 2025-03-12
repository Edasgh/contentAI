"use client";
import { FeatureFlag } from "@/features/flags";
import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";

export default function AudienceAnalysis({ videoId }: { videoId: string }) {
  const { user } = useUser();
  
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

      

      {/* No comments fetched yet */}

     
    </div>
  );
}
