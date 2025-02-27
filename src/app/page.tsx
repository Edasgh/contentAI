import Agentpulse from "@/components/Agentpulse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import YoutubeVideoForm from "@/components/YoutubeVideoForm";
import {
  Activity,
  BarChart,
  Brain,
  ChartBar,
  CheckCircle,
  File,
  ImageDownIcon,
  MessageCircle,
  PenBoxIcon,
  Share,
  // TagIcon,
  Video,
} from "lucide-react";

const features = [
  {
    title: "AI Analysis",
    description:
      "Get deep insights into your video content with our advanced AI Analysis. Understand viewer engagement and content quality.",
    icon: Brain,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Auto Transcription",
    description:
      "Convert YouTube videos into accurate, time-stamped transcripts with AI-powered speech-to-text processing.",
    icon: File,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "AI Script Generator",
    description:
      "Generate engaging video scripts based on trending topics and your niche, optimized for YouTube audience retention.",
    icon: PenBoxIcon,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Thumbnail Creator",
    description:
      "Create high-quality, eye-catching thumbnails automatically, designed for maximum click-through rates.",
    icon: ImageDownIcon,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  // {
  //   title: "SEO & Tag Optimization",
  //   description:
  //     "Optimize your video titles, descriptions, and tags using AI-driven SEO insights for better search rankings.",
  //   icon: TagIcon,
  //   iconBg: "bg-purple-100",
  //   iconColor: "text-purple-600",
  // },
  {
    title: "Competitor Insights",
    description:
      "Analyze your competitors' videos and gain actionable insights to improve your content strategy.",
    icon: ChartBar,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Trend Prediction",
    description:
      "Identify trending topics and content ideas before they go viral, helping you stay ahead of the competition.",
    icon: BarChart,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    title: "Engagement Metrics",
    description:
      "Track and analyze views, likes, comments, and audience retention to refine your content strategy.",
    icon: Activity,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    title: "Auto-Responder for Comments",
    description:
      "AI-powered comment replies to keep your audience engaged and enhance community interaction.",
    icon: MessageCircle,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    title: "Social Media Content Repurposing",
    description:
      "Automatically generate short clips and captions for platforms like TikTok, Instagram, and Twitter.",
    icon: Share,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
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
      "Download the transcript, script, and AI-generated thumbnail, all optimized for better performance.",
    icon: CheckCircle,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-700">
        <div className="mx-auto pt-4">
          <div className="flex flex-col items-center gap-10 text-center mb-12">
            <Agentpulse size="large" color="blue" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-400 mb-6">
              Meet your personal&nbsp;
              <span className="bg-gradient-to-r from-blue-600 dark:from-blue-400 to-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
                AI Content Agent
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-500 mb-8 max-w-2xl mx-auto">
              Transform your content with AI powered analysis, transcription and
              insights. Get started in seconds.
            </p>
            {/* Youtube video form
             */}
            <YoutubeVideoForm />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-700/95">
        <div className="mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful features for Content Creators
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* feature cards */}
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-500   dark:hover:border-blue-300  transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg}`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How it works section */}
      <section className="py-20 px-4 md:px-0 bg-gray-50 dark:bg-gray-700">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet your AI Agent in 3 Simple Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg dark:hover:shadow-gray-500/50 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className={`w-8 h-8 text-white`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>

                <p className="text-gray-600 dark:text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer section */}
      <footer className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 ">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to meet your AI Content Agent?
          </h2>
          <p className="text-xl text-blue-50">
            Join creators leveraging AI to unlock content insights
          </p>
          <div className="flex mt-12 mx-auto max-w-sm items-center space-x-2">
            <Input suppressHydrationWarning type="email"  className="placeholder:text-white border-[0.3px] border-white focus-visible:border-white focus-visible:ring-gray-400/50"  placeholder="Email" />
            <Button  suppressHydrationWarning className="cursor-pointer" type="submit">Join Now</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
