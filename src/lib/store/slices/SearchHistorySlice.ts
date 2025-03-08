import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Video } from "@/types/types";

// Define a type for the slice state
export interface SearchHistoryState {
  videos: Video[];
}

// Define the initial state using that type
const initialState: SearchHistoryState = {
  videos: [],
};

export const SearchHistorySlice = createSlice({
  name: "SearchHistory",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    search: (state, action) => {
      state.videos.push(action.payload);
    },
    getVideos: (state, action) => {
      state.videos = action.payload;
    },
  },
});

export const { search, getVideos } = SearchHistorySlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state;

export default SearchHistorySlice.reducer;
