import mongoose from "mongoose";

const connectdb = (url) => {
  mongoose
    .connect(url, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};
export default connectdb;
