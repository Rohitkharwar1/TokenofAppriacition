import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  user: {},
};

const counter = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incre: (state) => {
      state.count = state.count + 1;
    },
    setUserDetails: (state, actions) => {
      state.user = actions.payload.user;
    },
  },
});

export const { incre, setUserDetails } = counter.actions;
export default counter.reducer;
