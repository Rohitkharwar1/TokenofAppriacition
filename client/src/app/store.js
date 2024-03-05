import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./resources/counter";

const rootReducer = {
  counter: counterReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
