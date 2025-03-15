/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as audience_analysis from "../audience_analysis.js";
import type * as blog from "../blog.js";
import type * as comments from "../comments.js";
import type * as images from "../images.js";
import type * as titles from "../titles.js";
import type * as transcripts from "../transcripts.js";
import type * as videoChapters from "../videoChapters.js";
import type * as videos from "../videos.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  audience_analysis: typeof audience_analysis;
  blog: typeof blog;
  comments: typeof comments;
  images: typeof images;
  titles: typeof titles;
  transcripts: typeof transcripts;
  videoChapters: typeof videoChapters;
  videos: typeof videos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
