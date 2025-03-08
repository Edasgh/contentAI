import { configureStore } from "@reduxjs/toolkit";
import SearchHistoryReducer from "./slices/SearchHistorySlice";

export const createStore = () => {
  return configureStore({
    reducer: { SearchHistory: SearchHistoryReducer },
  });
};

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>

export type AppDispatch = AppStore["dispatch"]
