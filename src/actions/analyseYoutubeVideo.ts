"use server";
import { getVideoIdFromUrl } from "@/lib/getVideoIdFromUrl";
import { redirect } from "next/navigation";

export async function analyseYoutubeVideo(formData:FormData) {
    const url = formData.get("url")?.toString();
    if(!url) return;

    const videoId=getVideoIdFromUrl(url); // TODO : fix it
    // console.log("videoId : ",videoId);
    if(!videoId) return;

    //redirect to the new post
    redirect(`/video/${videoId}/analysis`);
}