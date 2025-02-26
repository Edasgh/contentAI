import Agentpulse from "@/components/Agentpulse";
import YoutubeVideoForm from "@/components/YoutubeVideoForm";
import { Brain, Video } from "lucide-react";

const features = [
  {
    title: "AI Analysis",
    description:
      "Get deep insights into your video content with our advanced AI Analysis. Understand viewer engagement and content quality.",
    icon: Brain,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

const steps = [
  {
    title: "1. Connect with your content",
    description: "Share your YouTube video URL and let your agent get to work",
    icon: Video,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto pt-4">
          <div className="flex flex-col items-center gap-10 text-center mb-12">
            <Agentpulse size="large" color="blue" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Meet your personal &nbsp;
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                AI Content Agent
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your content with AI powered analysis, transcription and
              insights. Get started in seconds.
            </p>
            {/* Youtube video form
             */}
             <YoutubeVideoForm/>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful features for Content Creators
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* feature cards */}
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg}`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How it works section */}
      <section className="py-20 px-4 md:px-0 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet your AI Agent in 3 Simple Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className={`w-8 h-8 text-white`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>

                <p className="text-gray-600">{step.description}</p>
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
        </div>
      </footer>
    </div>
  );
}
