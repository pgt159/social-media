import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface ILoadingState {
  loading?: boolean;
}

// Define the initial state using that type
const initialState: ILoadingState = {
  loading: false,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    loadingToggle: (state, action) => {
      return {
        ...state,
        loading: !!action.payload,
      };
    },
  },
});

export const { loadingToggle } = loadingSlice.actions;

export default loadingSlice.reducer;
