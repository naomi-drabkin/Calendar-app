import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Calendar } from "../Models/Calendar";
import { RootState } from "./Store";

export const fetchDisignCalendar = createAsyncThunk("DesignCalendar/fetch",
  async (_, thunkApi) => {
    try {      
      const res = await axios.get("https://calendar-app-server-fn9y.onrender.com/api/calendars/user",
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}`}
        }
      );
      return res.data as Calendar[];
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addDesignCalendar = createAsyncThunk('DesignCalendar/add', async (DisignCalendar: Partial<Calendar>, thunkApi) => {
  try {
    const res = await axios.post("https://calendar-app-server-fn9y.onrender.com/api/calendars",
      DisignCalendar,
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}` }
      });  
    
    return res.data as Calendar[];
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const DesignCalendarSlice = createSlice({
  name: "DesignCalendar",
  initialState: {
    listDesignCalendar: [] as Calendar[],
    loading: true,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.
      addCase(fetchDisignCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisignCalendar.fulfilled, (state, action: PayloadAction<Calendar[]>) => {
        state.loading = false,
          state.error = null,
          state.listDesignCalendar = action.payload
      })
      .addCase(fetchDisignCalendar.rejected, (state) => {
        state.loading = false,
          state.error = "Failed to load recipes"
      })
      .addCase(addDesignCalendar.pending, (state) => {
        state.loading = true,
          state.error = null
      })
      .addCase(addDesignCalendar.fulfilled, (state, action: PayloadAction<Calendar[]>) => {
        state.listDesignCalendar = action.payload
      })
      .addCase(addDesignCalendar.rejected, (state) => {
        state.loading = false,
          state.error = "Failed to add recipes"
      })
  }
});

export const selectDesignCalendar = (state: RootState) => state.DesignCalendar;

export default DesignCalendarSlice;

