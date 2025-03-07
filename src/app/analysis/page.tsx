"use client";

import Agentpulse from "@/components/Agentpulse";
import YoutubeVideoForm from "@/components/YoutubeVideoForm";

export default function Analysis() {
  return (
    <section className="py-16">
      <div className="mx-auto pt-4">
        <div className="flex flex-col items-center gap-10 text-center mb-12">
          <Agentpulse size="large" color="blue" />
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-400 mb-6">
            <span className="bg-gradient-to-r from-blue-600 dark:from-blue-400 to-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
              Analyse&nbsp;
            </span>
            New Video
          </h1>

          <p className="text-2xl text-gray-600 dark:text-gray-500 mb-8 max-w-5xl mx-auto">
            Transform your content with AI powered analysis, transcription and
            insights. Get started in seconds.
          </p>

          {/* Youtube video form
           */}
          <YoutubeVideoForm />
        </div>
      </div>
    </section>
  );
}
