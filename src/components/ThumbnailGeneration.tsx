"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import Usage from "./Usage";
import { FeatureFlag } from "@/features/flags";
import Image from "next/image";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "react-toastify";

interface Thumbnail {
  url: string | null;
  _id: Id<"images">;
  _creationTime: number;
  videoId: string;
  userId: string;
  storageId: Id<"_storage">;
}

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
  const imageList: Thumbnail[] = images || [];

  const handleDownload = async ({
    imgUrl,
    fileName,
  }: {
    imgUrl: string;
    fileName: string;
  }) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "downloaded-image.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(blobUrl); // Cleanup

      toast.success("Thumbnail downloaded successfully!")

    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Couldn't download! Try again later.");
    }
  };

  return (
    <div className="flex flex-col dark:border-gray-600 shadow-md rounded-xl p-4 border">
      <div className="min-w-52">
        <Usage
          featureFlag={FeatureFlag.IMG_GENERATION}
          title="Thumbnail Generation"
        />
      </div>

      {/* Thumbnails List */}
      {imageList.length > 0 ? (
        <div className="flex overflow-x-auto gap-4 mt-4">
          {imageList.map((img) => (
            <div
              key={img._id}
              className="flex-none w-[200px] h-[110px] rounded-lg overflow-hidden"
            >
              <Image
                src={img.url ?? ""}
                alt="Generated thumbnail"
                title="Download Thumbnail"
                width={200}
                height={110}
                className="object-cover w-full h-full cursor-pointer"
                onClick={() =>
                  handleDownload({
                    imgUrl: img.url ?? "",
                    fileName: `thumbnail-${img._id}.jpg`,
                  })
                }
              />
            </div>
          ))}
        </div>
      ) : !isImgGenerationEnabled ? (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No thumbnails have been generated yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Generate thumbnails to see them appear here
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ThumbnailGeneration;
