import TOA from "../model/toa.js";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import { sendEmail } from "../utils/emailutilts.js";

// Create a new TOA
export const createTOA = async (req, res) => {
  // Extract the JWT token from the request headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Decode the JWT token to get user information
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Extract the user ID from the decoded token
    const userId = decoded.userId;

    const { recipient, reason, points } = req.body;

    // Find the sender and recipient users by their IDs using the `User.findById` method
    const sender = await User.findById(userId);
    const recipientUser = await User.findById(recipient);

    // Check if the sender has sufficient points in their wallet
    if (sender.wallet < 10) {
      return res.status(400).json({ message: "Insufficient points in wallet" });
    }

    // Calculate the value of tokens based on points
    const tokenValue = 10;

    // Create a new TOA if the sender has enough points
    const newTOA = new TOA({
      sender: {
        id: sender.id,
        name: sender.name,
        userType: sender.userType,
      },
      recipient: {
        id: recipientUser.id,
        name: recipientUser.name,
        userType: recipientUser.userType,
      },
      reason,
      points,
    });

    await newTOA.save();

    // Deduct points from the sender's wallet
    sender.wallet -= 10; // Deduct the points used for the TOA
    await sender.save();

    // Update recipient's tokenAlloted property
    recipientUser.tokenAlloted += 1;
    await recipientUser.save();

    // Send email upon TOA creation
    await sendEmail(
      recipientUser.email,
      recipientUser.name,
      sender.name,
      reason
    );

    res.json({
      status: res.statusCode,
      message: "Token of Appreciation Generated.",
      data: {
        reason,
        points,
        createdBy: {
          id: sender.id,
          name: sender.name,
          userType: sender.userType,
        },
        recipient: {
          id: recipientUser.id,
          name: recipientUser.name,
          email: recipientUser.email,
          userType: recipientUser.userType,
        },
      },
    });
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get all TOAs for the logged-in user
export const getAllTOA = async (req, res) => {
  // Extract the JWT token from the request headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Decode the JWT token to get user information
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Extract the user ID from the decoded token
    const userId = decoded.userId;

    // Find all TOAs where the logged-in user is the sender or recipient
    const toas = await TOA.find({
      $or: [{ "sender.id": userId }, { "recipient.id": userId }],
    });

    res.json({
      status: res.statusCode,
      message: "TOAs fetched successfully",
      data: toas,
    });
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const getAllAllottedTOA = async (req, res) => {
  // Extract the JWT token from the request headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Decode the JWT token to get user information
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Extract the user ID from the decoded token
    const userId = decoded.userId;

    // Find all TOAs where the logged-in user is the sender
    const toas = await TOA.find({ "sender.id": userId });

    res.json({
      status: res.statusCode,
      message: "Allotted TOAs fetched successfully",
      data: toas,
    });
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
