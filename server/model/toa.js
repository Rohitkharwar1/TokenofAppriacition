import mongoose from "mongoose";
const TOASchema = new mongoose.Schema({
  sender: {
    id: String,
    name: String,
    userType: String,
  },
  recipient: {
    id: String,
    name: String,
    userType: String,
  },
  reason: String,
  points: Number,
});

const TOA = mongoose.model("Toa", TOASchema);
export default TOA;
