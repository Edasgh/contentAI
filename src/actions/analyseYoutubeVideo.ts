"use server";
import { getVideoIdFromUrl } from "@/lib/getVideoIdFromUrl";
import { redirect } from "next/navigation";

export async function analyseYoutubeVideo(formData:FormData) {
    const url = formData.get("url")?.toString();
    if(!url) return;

    const videoId=await getVideoIdFromUrl(url); // TODO : fix it
    // console.log("videoId : ",videoId);
    if(!videoId) return;

    //redirect to the new post
    redirect(`/analysis/video/${videoId}`);
}