"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import Usage from "./Usage";
import { FeatureFlag } from "@/features/flags";
import Image from "next/image";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const ThumbnailGeneration = ({ videoId }: { videoId: string }) => {
  const { user } = useUser();
  const images = useQuery(api.images.getImages, {
    videoId,
    userId: user?.id ?? "",
  });

  const { value: isImgGenerationEnabled } = useSchematicEntitlement(
    FeatureFlag.IMG_GENERATION
  );

  // Ensure images is always an array to prevent undefined issues
  const imageList = images || [];

  return (
    <div className="flex flex-col rounded-xl p-4 border">
      <div className="min-w-52">
        <Usage
          featureFlag={FeatureFlag.IMG_GENERATION}
          title="Thumbnail Generation"
        />
      </div>

      {/* Simple horizontal scroll for images */}
      {imageList.length > 0 && (
        <div className="flex overflow-x-auto gap-4 mt-4">
          {imageList.map(
            (img) =>
              img.url && (
                <div
                  key={img._id}
                  className="flex-none w-[200px] h-[110px] rounded-lg overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt="generated image"
                    width={200}
                    height={110}
                    className="object-cover w-full h-full"
                  />
                </div>
              )
          )}
        </div>
      )}

      {/* No images generated yet */}
      {imageList.length === 0 && !isImgGenerationEnabled && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No thumbnails have been generated yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Generate thumbnails to see them appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGeneration;
