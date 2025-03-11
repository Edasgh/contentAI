import { Id } from "../../convex/_generated/dataModel";

export interface ChannelDetails{
    title:string;
    thumbnail:string;
    subscribers:string;
}

export interface VideoDetails{
    title:string;
    description:string;
    views:string;
    likes:string;
    comments:string;
    thumbnail:string;
    channel:ChannelDetails;
    publishedAt:string;

}

export interface Video {
  _id: Id<"videos">;
  _creationTime: number;
  videoId: string;
  userId: string;
}