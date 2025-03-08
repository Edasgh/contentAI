"use client";

import { FeatureFlag } from "@/features/flags";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { useCallback, useEffect, useState } from "react";
import Usage from "./Usage";
import { getYtTranscript } from "@/actions/getYtTranscript";
interface TranscriptEntry {
  text: string;
  timestamp: string;
}
const Transcription = ({ videoId }: { videoId: string }) => {
  const [transcript, setTranscript] = useState<{
    transcript: TranscriptEntry[];
    cache: string;
  } | null>(null);

  const { featureUsageExceeded } = useSchematicEntitlement(
    FeatureFlag.TRANSCRIPTION
  );

  const handleGenerateTranscriptions = useCallback(
    async (videoId: string) => {
      if (featureUsageExceeded) {
        console.log("Transcription limit reached, the user must upgrade");
        return;
      }

      const result = await getYtTranscript(videoId);
      setTranscript(result);
    },
    [featureUsageExceeded]
  );

  useEffect(() => {
    handleGenerateTranscriptions(videoId);
  }, [handleGenerateTranscriptions, videoId]);

  if (!videoId) {
    return <div className="text-gray-500 text-center py-4">Loading....</div>;
  }

  return (
    <div className="border border-gray-200 dark:border-gray-600 shadow-md pb-0 p-4 rounded-xl gap-4 flex flex-col">
      <Usage featureFlag={FeatureFlag.TRANSCRIPTION} title="Transcripts" />

      {!featureUsageExceeded ? (
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4">
          {" "}
          {transcript ? (
            transcript.transcript.map((entry, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-sm text-gray-400 min-w-[50px]">
                  {entry.timestamp}
                </span>

                <p className="text-sm Otext-gray-700">{entry.text}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No transcription available
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Transcription;
