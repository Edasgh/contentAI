"use client";
import Agentpulse from "@/components/Agentpulse";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  ArrowRight,
  BarChart,
  CheckCircle,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Transcript Generation for any YouTube Video",
    image: "transcript.png",
  },
  {
    title: "Ask Anything About Video",
    image: "analysis.png",
  },
  {
    title: "AI Powered Video Chapters",
    image: "chapters.png",
  },
  {
    title: "Generate Customized Video Scripts",
    image: "shooting_script.png",
  },
  {
    title: "Generate High-quality, Click Worthy Thumbnails & Titles",
    image: "thumbnail.png",
  },
  {
    title: "Audience Analysis of Any YouTube Video",
    image: "audience.png",
  },
];


const steps = [
  {
    title: "1. Connect with your content",
    description: "Share your YouTube video URL and let your agent get to work.",
    icon: Video,
  },
  {
    title: "2. Get AI-Powered Insights",
    description:
      "Our AI extracts the transcript, analyzes engagement, and generates a script for a similar video.",
    icon: BarChart,
  },
  {
    title: "3. Receive Your Ready-to-Use Content",
    description:
      "Copy the script, Download the AI-generated thumbnail, all optimized for better performance.",
    icon: CheckCircle,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 w-full bg-grid">
        <div className="mx-auto pt-4">
          <div className="flex flex-col items-center gap-10 text-center mb-12">
            <Agentpulse size="large" color="blue" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-400 mb-6">
              Meet your personal&nbsp;
              <span className="bg-gradient-to-r from-blue-600 dark:from-blue-400 to-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
                AI Content Agent
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-500 mb-8 max-w-5xl mx-auto">
              Transform your content with AI powered analysis, transcription and
              more. Get started in seconds.
            </p>
            <SignedIn>
              <Link
                className="relative inline-flex gap-2 items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 dark:from-blue-950 dark:to-blue-700 rounded-full hover:from-gray-800 hover:to-gray-700 dark:hover:from-blue-900 dark:hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                href={"/analysis"}
              >
                Get Started <ArrowRight suppressHydrationWarning />
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton
                mode="modal"
                fallbackRedirectUrl={"/"}
                forceRedirectUrl={"/"}
              >
                <button className="group cursor-pointer relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white dark:text-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-blue-950 dark:to-blue-700 rounded-full hover:from-gray-800 hover:to-gray-700 dark:hover:from-blue-900 dark:hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 dark:text-gray-300" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 dark:from-gray-700/30 dark:to-gray-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900/95">
        <div className="mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Powerful features for Content Creators
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* feature cards */}
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-tl from-blue-200 dark:from-blue-700 via-gray-200 dark:via-gray-800 to-blue-500 dark:to-blue-950 group p-6 py-10 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-500   dark:hover:border-blue-300 hover:bg-gradient-to-l transition-all duration-1000 flex flex-col h-[420px] relative overflow-hidden"
              >
                <Link href={"/analysis"}>
                  <Image
                    src={`/images/${feature.image}`}
                    width={360}
                    height={270}
                    alt={`${feature.title}`}
                    className="object-contain rounded-lg opacity-90 shadow-blue-900 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                  />
                </Link>
                <h3 className="text-xl text-black dark:text-white font-semibold mt-4">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How it works section */}
      <section className="py-20 px-4 md:px-0 bg-gray-50 dark:bg-gray-800/95">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet your AI Agent in 3 Simple Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white dark:bg-gray-700 shadow-md hover:shadow-lg dark:shadow-gray-900 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className={`w-8 h-8 text-white`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>

                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer section */}
      <footer className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to meet your AI Content Agent?
          </h2>
          <p className="text-xl text-blue-50">
            Join creators leveraging AI to unlock content insights
          </p>

          <SignedIn>
            <Button suppressHydrationWarning className="cursor-pointer my-5">
              <Link href="/analysis">Get Started</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              fallbackRedirectUrl={"/"}
              forceRedirectUrl={"/"}
            >
              <Button className="cursor-pointer my-5">Get Started</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </footer>
    </div>
  );
}
