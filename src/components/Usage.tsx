"use client";

import { FeatureFlag } from "@/features/flags";
import {
  useSchematicEntitlement,
  useSchematicIsPending,
} from "@schematichq/schematic-react";
import { Progress } from "./ui/progress";

const Usage = ({
  featureFlag,
  title,
}: {
  featureFlag: FeatureFlag;
  title: string;
}) => {
  const isPending = useSchematicIsPending();
  const {
    featureAllocation = 1, // Avoid division by zero
    featureUsage = 0,
    value: isFeatureEnabled,
  } = useSchematicEntitlement(featureFlag);

  const hasUsedAllTokens = featureUsage >= featureAllocation;

  if (isPending) {
    return <div className="text-gray-500 text-center py-4">Loading...</div>;
  }

  if (hasUsedAllTokens) {
    return (
      <div className="text-gray-500 text-center py-4">
        <p>You've used all your tokens for this feature.</p>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          <div className="px-4 py-2 bg-red-50 rounded-lg">
            <span className="font-medium text-red-700">{featureUsage}</span>
            <span className="text-red-400 mx-2">/</span>
            <span className="font-medium text-red-700">
              {featureAllocation}
            </span>
          </div>
        </div>
        <div className="relative">
          <Progress
            value={100}
            className="h-3 rounded-full bg-gray-200 [&>*]:bg-red-600"
          />
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">
            You've used all available tokens. Please upgrade your plan to
            continue using this feature.
          </p>
        </div>
      </div>
    );
  }

  if (!isFeatureEnabled) {
    return (
      <div className="p-2 opacity-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800  dark:text-gray-100 ">{title}</h2>
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Feature Disabled</span>
          </div>
        </div>
        <div className="relative">
          <Progress value={0} className="h-3 rounded-full bg-gray-100" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Upgrade to use this feature
          </p>
        </div>
      </div>
    );
  }

  const progress = (featureUsage / featureAllocation) * 100;

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return "bg-red-600";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <div className="px-4 py-2 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">{featureUsage}</span>
          <span className="text-gray-400 mx-2">/</span>
          <span className="font-medium text-gray-700">{featureAllocation}</span>
        </div>
      </div>
      <div className="relative">
        <Progress
          value={progress}
          className={`h-3 rounded-full bg-gray-100 dark:bg-gray-700 [&>*]:${getProgressColor(progress)}`}
        />

        {progress >= 100 ? (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            You have reached your usage limit
          </p>
        ) : progress >= 80 ? (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Warning: You are approaching your usage limit
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Usage;
