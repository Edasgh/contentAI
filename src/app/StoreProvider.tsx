"use client";

import { createStore, AppStore } from "@/lib/store/store";
import { Provider } from "react-redux";
import React, { ReactNode, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getVideos } from "@/lib/store/slices/SearchHistorySlice";
import Cookies from "js-cookie";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = createStore();

    // Retrieve videos from cookies
    const persistedState = Cookies.get("reduxStore");
    if (persistedState) {
      try {
        const parsedState = JSON.parse(persistedState);
        if (parsedState?.searchHistory?.videos) {
          storeRef.current.dispatch(
            getVideos(parsedState.searchHistory.videos)
          );
        }
      } catch (error) {
        console.error("Error parsing stored videos:", error);
      }
    }
  }


  // Fetch videos using Convex
  const videosFromConvex = useQuery(api.videos.get, {}) || [];

  // Dispatch action when videos are available
  useEffect(() => {
    if (videosFromConvex && videosFromConvex.length !== 0) {
      storeRef.current?.dispatch(getVideos(videosFromConvex));
    }
  }, [videosFromConvex]); // Runs whenever `videosFromConvex` updates

  // Save Redux store to cookies whenever it updates
  useEffect(() => {
    const handleStateChange = () => {
      const state = storeRef.current?.getState();
      if (state) {
        Cookies.set("reduxStore", JSON.stringify(state), {
          expires: 7, // Store for 7 days
          secure: true, // Use only over HTTPS
          sameSite: "Strict",
        });
      }
    };

    const unsubscribe = storeRef.current?.subscribe(handleStateChange);

    return () => unsubscribe?.(); // Cleanup on unmount
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
