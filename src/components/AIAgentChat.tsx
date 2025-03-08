"use client";

import { Message, useChat } from "@ai-sdk/react";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flags";
import { BotIcon, ImageIcon, LetterText, PenIcon } from "lucide-react";
import { toast } from "react-toastify";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  result?: Record<string, unknown>;
}

interface ToolPart {
  type: "tool-invocation";
  toolInvocation: ToolInvocation;
}

function formatToolCall(part: ToolPart) {
  return `Tool Used: ${part.toolInvocation.toolName}`;
}

const AIAgentChat = ({ videoId }: { videoId: string }) => {
  const { messages, input, handleInputChange, handleSubmit, append, status } =
    useChat({
      maxSteps: 10,
      body: { videoId },
    });

  const IsScriptGenEnabled = useSchematicFlag(FeatureFlag.SCRIPT_GENERATION);
  const IsImgGenEnabled = useSchematicFlag(FeatureFlag.IMG_GENERATION);
  const IsTitleGenEnabled = useSchematicFlag(FeatureFlag.TITLE_GENERATIONS);
  const IsVideoAnalysisEnabled = useSchematicFlag(FeatureFlag.ANALYSE_VIDEO);

  async function generateScript() {
    const randomId = Math.random().toString(36).substring(2, 15);
    const userMessage: Message = {
      id: `generate-script-${randomId}`,
      role: "user",
      content: `Generate a step by step shooting script for this video : ${videoId} so, that I can use on my own channel to produce a video that is similar to this one, don't do any other steps such as generating an image, just generate the script only!`,
    };

    append(userMessage);
  }

  async function generateTitle() {
    const randomId = Math.random().toString(36).substring(2, 15);
    const userMessage: Message = {
      id: `generate-script-${randomId}`,
      role: "user",
      content: `Generate a strong SEO title for this video: ${videoId} that conveys the concept of the video. The title should be a single line and should be a maximum of 60 characters. The title should be SEO optimized.`,
    };

    append(userMessage);
  }
  async function generateImage() {
    const randomId = Math.random().toString(36).substring(2, 15);
    const userMessage: Message = {
      id: `generate-script-${randomId}`,
      role: "user",
      content: `Generate a Youtube Thumbnail for this video: ${videoId} that conveys the same message as the video. The thumbnail should be a high-quality image that is 1280x720 pixels in size. The thumbnail should be a single image and not a video. The thumbnail should be in .webp format. The thumbnail should generate interest and drive engagement for the video on Youtube.`,
    };

    append(userMessage);
  }

  const msgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let toastId;

    switch (status) {
      case "submitted":
        toastId = toast("Agent is thinking...", {
          toastId: toastId,
          icon: <BotIcon className="w-4 h-4" />,
          autoClose: 2000,
        });
        break;
      case "streaming":
        toastId = toast("Agent is replying...", {
          toastId: toastId,
          icon: <BotIcon className="w-4 h-4" />,
          autoClose: 2000,
        });
        break;
      case "error":
        toastId = toast("Whoops! Something went wrong, please try again.", {
          toastId: toastId,
          icon: <BotIcon className="w-4 h-4" />,
          autoClose: 2000,
        });
        break;
      case "ready":
        toast.dismiss(toastId);

        break;
    }
  }, [status]);

  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
          AI Agent
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  Welcome to AI Agent Chat
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask any question about your video!
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {/* Ensure messages are not duplicated */}
                  {message.parts?.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <div
                          key={i}
                          className={`prose prose-sm max-w-none ${message.role === "user" ? "text-white" : "dark:text-white"} `}
                        >
                          <ReactMarkdown>{part.text}</ReactMarkdown>
                        </div>
                      );
                    }
                    if (part.type === "tool-invocation") {
                      const toolPart = part as ToolPart;
                      return (
                        <div
                          key={i}
                          className="bg-white/50 dark:bg-black rounded-lg p-2 space-y-2 text-gray-800 dark:text-gray-300"
                        >
                          <div className="font-medium text-xs">
                            {formatToolCall(toolPart)}
                          </div>
                          {toolPart.toolInvocation.result && (
                            <pre className="text-xs bg-white/75 dark:bg-white/20 p-2 rounded overflow-auto max-h-40">
                              {JSON.stringify(
                                toolPart.toolInvocation.result,
                                null,
                                2
                              )}
                            </pre>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))
          )}
        </div>
        <div ref={msgRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-100 dark:border-gray-600 p-4 bg-white dark:bg-gray-700">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2"
          suppressHydrationWarning
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={
              !IsVideoAnalysisEnabled
                ? "Upgrade to ask anything about your video..."
                : "Ask anything about your video..."
            }
            className="flex-1 px-4 py-2 text-sm border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200"
            disabled={
              status === "streaming" ||
              status === "submitted" ||
              !IsVideoAnalysisEnabled
            }
            suppressHydrationWarning
          />
          <Button
            disabled={
              status === "streaming" ||
              status === "submitted" ||
              !IsVideoAnalysisEnabled
            }
            className="cursor-pointer disabled:cursor-not-allowed"
            suppressHydrationWarning
            type="submit"
          >
            {status === "streaming"
              ? "🤖 Replying.."
              : status === "submitted"
                ? "🤖 Thinking.."
                : "Send"}
          </Button>
        </form>
        <div className="flex gap-2 mt-2.5">
          <button
            type="button"
            className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
            disabled={
              status === "streaming" ||
              status === "submitted" ||
              !IsScriptGenEnabled
            }
            onClick={generateScript}
          >
            <LetterText className="w-4 h-4" />
            {IsScriptGenEnabled ? (
              <span>Generate Script</span>
            ) : (
              <span>Upgrade to Generate a Script</span>
            )}
          </button>
          <button
            type="button"
            className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
            disabled={
              status === "streaming" ||
              status === "submitted" ||
              !IsTitleGenEnabled
            }
            onClick={generateTitle}
          >
            <PenIcon className="w-4 h-4" />
            {IsTitleGenEnabled ? (
              <span>Generate Title</span>
            ) : (
              <span>Upgrade to Generate a Title</span>
            )}
          </button>
          <button
            type="button"
            className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
            disabled={
              status === "streaming" ||
              status === "submitted" ||
              !IsImgGenEnabled
            }
            onClick={generateImage}
          >
            <ImageIcon className="w-6 h-6" />
            {IsImgGenEnabled ? (
              <span>Generate a Thumbnail</span>
            ) : (
              <span>Upgrade to Generate a Thumbnail</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAgentChat;
