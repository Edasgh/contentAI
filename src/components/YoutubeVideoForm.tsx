"use client";
import Form from "next/form";
import AnalyseButton from "./AnalyseButton";
import { Input } from "./ui/input";
import { analyseYoutubeVideo } from "@/actions/analyseYoutubeVideo";

const YoutubeVideoForm = () => {
  return (
    <Form
      action={analyseYoutubeVideo}
      className="flex w-full max-w-sm items-center space-x-2"
    suppressHydrationWarning >
      <Input name="url" type="text" placeholder="Enter Video URL" suppressHydrationWarning />
      <AnalyseButton/>
    </Form>
  );
};

export default YoutubeVideoForm;
