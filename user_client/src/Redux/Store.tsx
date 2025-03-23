import { combineSlices, configureStore } from "@reduxjs/toolkit";
import DesignCalendarSlice from "./DesignCalendarSlice";

export const Store = configureStore({
  reducer: combineSlices(DesignCalendarSlice)
});

export type RootState = ReturnType<typeof Store.getState>;

export type AppDispatch = typeof Store.dispatch;
export default Store;