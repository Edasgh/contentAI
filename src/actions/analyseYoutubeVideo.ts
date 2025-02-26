"use server";
import { redirect } from "next/navigation";

export async function analyseYoutubeVideo(formData:FormData) {
    const url = formData.get("url")?.toString();
    if(!url) return;

    const videoId="abc"; // TODO : fix it
    if(!videoId) return;

    //redirect to the new post
    redirect(`/video/${videoId}/analysis`);
}