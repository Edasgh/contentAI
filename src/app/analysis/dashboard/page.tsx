"use client";
import AllMyBlogs from "@/components/AllMyBlogs";
import AllMyPosts from "@/components/AllMyPosts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoTile from "@/components/VideoTile";
import { FeatureFlag } from "@/features/flags";
import { useAppSelector } from "@/lib/store/hooks";
import { Video } from "@/types/types";
import {
  useSchematicEntitlement,
  useSchematicIsPending,
} from "@schematichq/schematic-react";
import {
  GlassesIcon,
  ImageIcon,
  LetterTextIcon,
  NotebookTabs,
  NotepadTextDashedIcon,
  PlusIcon,
  TextIcon,
  VideoIcon,
} from "lucide-react";

import Link from "next/link";
import React, { useState } from "react";

const UsageCard = ({
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
  // <div className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-500 rounded-xl">
  if (isPending) {
    return (
      <div className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-500 shadow-xl dark:shadow-2xl rounded-xl">
        <div className="flex justify-between items-center mb-4 gap-7">
          <span className="w-52 h-2.5  bg-gray-800 dark:bg-gray-200 rounded-lg animate-pulse" />
          <div className="px-4 py-2 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="relative bg-gray-300 dark:bg-gray-700 rounded-xl w-36 h-2 animate-pulse" />
        <div className="relative bg-gray-300 dark:bg-gray-700 rounded-xl w-12 h-3 animate-pulse" />
      </div>
    );
  }

  if (hasUsedAllTokens) {
    return (
      <div className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-500 shadow-xl rounded-xl">
        <div className="text-gray-500 text-center py-4">
          <p>You've used all your tokens for this feature.</p>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </h2>
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
      </div>
    );
  }

  if (!isFeatureEnabled) {
    return (
      <Link title="Upgrade to use this feature" href={"/manage_plan"}>
        <div className="bg-inherit rounded-2xl border border-gray-200 dark:border-gray-500 shadow-xl p-7 opacity-50">
          <div className="flex gap-3 justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </h2>
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
      </Link>
    );
  }

  const progress = (featureUsage / featureAllocation) * 100;

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return "bg-red-600";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-500 shadow-xl dark:shadow-2xl rounded-xl">
      {featureUsage !== 0 && (
        <div className="flex gap-3">
          {featureFlag === FeatureFlag.ANALYSE_VIDEO ? (
            <VideoIcon className="text-green-600" />
          ) : featureFlag === FeatureFlag.TRANSCRIPTION ? (
            <NotepadTextDashedIcon className="text-blue-500" />
          ) : featureFlag === FeatureFlag.TITLE_GENERATIONS ? (
            <TextIcon className="text-cyan-600 dark:text-cyan-500" />
          ) : featureFlag === FeatureFlag.IMG_GENERATION ? (
            <ImageIcon className="text-red-400 dark:text-red-300" />
          ) : featureFlag === FeatureFlag.AUDIENCE_ANALYSIS ? (
            <GlassesIcon className="text-blue-500" />
          ) : featureFlag === FeatureFlag.SCRIPT_GENERATION ? (
            <NotebookTabs />
          ) : (
            <LetterTextIcon className="text-blue-500" />
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {featureUsage}{" "}
            {featureFlag === FeatureFlag.ANALYSE_VIDEO
              ? "Videos analysed"
              : featureFlag === FeatureFlag.TRANSCRIPTION
                ? "Videos Transcribed"
                : featureFlag === FeatureFlag.TITLE_GENERATIONS
                  ? "Titles Generated"
                  : featureFlag === FeatureFlag.IMG_GENERATION
                    ? "Thumbnails Generated"
                    : featureFlag === FeatureFlag.AUDIENCE_ANALYSIS
                      ? "Videos' Audience Analysed"
                      : featureFlag === FeatureFlag.SCRIPT_GENERATION
                        ? "Scripts Generated"
                        : "Videos' Chapters Generated"}
          </p>
        </div>
      )}
      <div className="flex justify-between items-center mb-4 gap-7">
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

const TabComponent = ({
  searchesComp,
  blogsComp,
  postsComp,
}: {
  searchesComp: React.ReactNode;
  blogsComp: React.ReactNode;
  postsComp: React.ReactNode;
}) => {
  return (
    <Tabs defaultValue="recent_searches" className="w-full md:w-2/3">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger className="cursor-pointer" value="recent_searches">
          Recent Searches
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="my_blogs">
          My Blogs
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="my_posts">
          My Posts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="recent_searches">{searchesComp}</TabsContent>
      <TabsContent value="my_blogs">{blogsComp}</TabsContent>
      <TabsContent value="my_posts">{postsComp}</TabsContent>
    </Tabs>
  );
};

const Dashboard = () => {
  const videos = useAppSelector((state) => state?.SearchHistory?.videos);

  const videoList: Video[] = videos || [];
  return (
    <section className="py-16 px-10">
      {/* Total Usage */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-400 mb-6">
          Your Total Usage
        </h1>
      </div>
      <div className="my-4 border-b border-gray-200 dark:border-gray-700" />
      <div className="mx-auto pt-4 flex flex-wrap gap-10">
        <UsageCard
          featureFlag={FeatureFlag.ANALYSE_VIDEO}
          title="Video Analysis"
        />
        <UsageCard
          featureFlag={FeatureFlag.TRANSCRIPTION}
          title="Transcriptions"
        />
        <UsageCard
          featureFlag={FeatureFlag.TITLE_GENERATIONS}
          title="Title Generation"
        />
        <UsageCard
          featureFlag={FeatureFlag.IMG_GENERATION}
          title="Thumbnail Generation"
        />
        <UsageCard
          featureFlag={FeatureFlag.AUDIENCE_ANALYSIS}
          title="Audience Analysis"
        />
        <UsageCard
          featureFlag={FeatureFlag.VIDEO_CHAPTERS}
          title="Video Chapters"
        />
        <UsageCard
          featureFlag={FeatureFlag.SCRIPT_GENERATION}
          title="Script Generation"
        />
      </div>
      {/* Tab SECTION */}
      <div className="flex flex-col w-full mt-16 gap-4 items-start">
        <Link href="/analysis" className="mb-3">
          <Button
            title="Analyse New Video"
            variant="secondary"
            className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 
             border border-gray-300 dark:border-gray-600 
             hover:bg-gray-300 dark:hover:bg-gray-700
             p-4 py-5 rounded-full transition-all text-2xl cursor-pointer"
          >
            <PlusIcon />
          </Button>
        </Link>

        <TabComponent
         postsComp={<AllMyPosts/>}
          blogsComp={<AllMyBlogs />}
          searchesComp={
            <div className="mt-3">
              {videoList.length !== 0 &&
                videoList.map((video) => (
                  <VideoTile
                    key={video.videoId}
                    videoId={video.videoId}
                    createdAt={video._creationTime}
                  />
                ))}
            </div>
          }
        />
      </div>
    </section>
  );
};

export default Dashboard;
