"use client";
import {
  ChevronDown,
  ChevronUpIcon,
  HomeIcon,
  LucidePackage,
  PenIcon,
  TerminalSquareIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useEffect, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { VideoDetails } from "@/types/types";
import { getVideoDetails } from "@/actions/getVideoDetails";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";

interface Video {
  _id: Id<"videos">;
  _creationTime: number;
  videoId: string;
  userId: string;
}

const SearchHistory = ({
  videoId,
  open,
}: {
  videoId: string;
  open: boolean;
}) => {
  const [video, setVideo] = useState<VideoDetails>();
  const [isError, setIsError] = useState(false);

  const params = useParams<{ videoId: string }>();
  const { videoId: paramVideoId } = params;

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const videoDetails = await getVideoDetails(videoId);
      //   console.log("video details",videoDetails);
      if (!videoDetails) {
        console.log("video not found!");
        setIsError(true);
        return;
      }
      setVideo(videoDetails);
    };
    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  if (open && (isError || !videoId)) {
    return (
      <SidebarMenuItem
        className="ml-3.5 border-r p-0.5 bg-gray-100 hover:bg-blue-100 dark:bg-gray-900 border-blue-500 dark:border-blue-300 dark:hover:bg-gray-700"
        suppressHydrationWarning
      >
        <SidebarMenuButton
          className="hover:bg-inherit break-words h-fit"
          suppressHydrationWarning
          asChild
        >
          <Link
            className="text-red-700 dark:text-red-300"
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/analysis/video/${videoId}`}
            suppressHydrationWarning
          >
            <span className="line-clamp-2" suppressHydrationWarning>
              <div
                className="text-inherit flex gap-2 justify-center items-center"
                suppressHydrationWarning
              >
                <span
                  className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
                  suppressHydrationWarning
                />
                <p
                  className="text-inherit animate-pulse"
                  suppressHydrationWarning
                >{`Video : ${videoId}`}</p>
              </div>
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <>
      {open && (
        <>
          {video ? (
            <>
              {/* Video details */}
              <SidebarMenuItem
                className={`${paramVideoId === videoId ? "bg-blue-100 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-900"} ml-3.5 border-r p-0.5  hover:bg-blue-100  border-blue-500 dark:border-blue-300 dark:hover:bg-gray-700`}
                suppressHydrationWarning
              >
                <SidebarMenuButton
                  className="hover:bg-inherit break-words h-fit"
                  title={video.title}
                  suppressHydrationWarning
                  asChild
                >
                  <Link
                    className="text-gray-700 dark:text-gray-50"
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/analysis/video/${videoId}`}
                    suppressHydrationWarning
                  >
                    <span className="line-clamp-2" suppressHydrationWarning>
                      <div className="text-inherit" suppressHydrationWarning>
                        <p className="text-inherit" suppressHydrationWarning>
                          {video.title}
                        </p>{" "}
                      </div>
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem
              className={`${paramVideoId === videoId ? "bg-blue-100 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-900"} ml-3.5 border-r p-0.5  hover:bg-blue-100  border-blue-500 dark:border-blue-300 dark:hover:bg-gray-700`}
              suppressHydrationWarning
            >
              <SidebarMenuButton
                className="hover:bg-inherit break-words h-fit"
                suppressHydrationWarning
                asChild
              >
                <Link
                  className="text-blue-400 dark:text-blue-300"
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/analysis/video/${videoId}`}
                  suppressHydrationWarning
                >
                  <span className="line-clamp-2" suppressHydrationWarning>
                    <div className="text-inherit" suppressHydrationWarning>
                      <p
                        className="text-inherit flex gap-2 justify-center items-center animate-pulse"
                        suppressHydrationWarning
                      >
                        <span
                          className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                          suppressHydrationWarning
                        />
                        {`Video : ${videoId}`}
                      </p>
                    </div>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </>
      )}
    </>
  );
};

export function AppSidebar() {
  const [open, setOpen] = useState(true);
  const videos = useAppSelector((state) => state.SearchHistory.videos);

  const videoList: Video[] = videos || [];
  return (
    <Sidebar className="mt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    className="text-gray-700 dark:text-gray-50"
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/`}
                  >
                    <HomeIcon />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    className="text-gray-700 dark:text-gray-50"
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/analysis`}
                  >
                    <PenIcon />
                    <span>Analyse New Video</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarGroupLabel>Recent Searches</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setOpen(!open)}
                    className="text-gray-700 dark:text-gray-50 cursor-pointer flex justify-between"
                    suppressHydrationWarning
                  >
                    <span className="w-full flex gap-2">
                      {" "}
                      <TerminalSquareIcon suppressHydrationWarning />
                      Recent Searches
                    </span>

                    {open ? (
                      <ChevronDown suppressHydrationWarning />
                    ) : (
                      <ChevronUpIcon suppressHydrationWarning />
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {open && (
                <>
                  {videoList?.length === 0 && (
                    <SidebarMenuItem className="ml-14">
                      <p className="text-gray-500 dark:text-gray-400">
                        No video searched...
                      </p>
                    </SidebarMenuItem>
                  )}
                </>
              )}

              {videoList?.map((item) => (
                <SearchHistory
                  open={open}
                  key={item._id}
                  videoId={item.videoId}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="sticky bottom-1/7">
          <SidebarMenuItem className="list-none">
            <SidebarMenuButton className="w-fit h-fit px-4" asChild>
              <Link
                className="text-gray-700 flex justify-start items-center dark:text-gray-50"
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/manage_plan`}
              >
                <LucidePackage />
                <span className="flex flex-col justify-start items-start">
                  <span className="text-xl">Upgrade plan</span>
                  <span className="text-sm">Get access to more features</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
