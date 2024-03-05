// server.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import connectdb from "./config/database.js";
import generateToken from "./utils/generateToken.js";
import userRoutes from "./routes/user.js";
import { errorHandler, notFound } from "./middlewares/error.js";
import toaRoutes from "./routes/toa.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection

// TOA model

// Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "rohitkharwar000@gmail.com",
//     pass: "Rohit@9833",
//   },
// });

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

// app.get("/token", async (req, res) => {
//   res.json({ token: generateToken(res, 1) });
// });

// app.get("/toa", (req, res) => {
//   TOA.find()
//     .then((toas) => res.json(toas))
//     .catch((err) => res.status(400).json({ error: err.message }));
// });

// app.post("/createTOA", (req, res) => {
//   const { sender, recipient, reason, points } = req.body;

//   const newTOA = new TOA({
//     sender,
//     recipient,
//     reason,
//     points,
//   });

//   newTOA
//     .save()
//     .then(() => {
//       //   sendEmail(recipient, reason); // Send email upon TOA creation
//       res.send("TOA created successfully");
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send("Error creating TOA");
//     });
// });

// Function to send email
// function sendEmail(recipient, reason) {
//   const mailOptions = {
//     from: "rohitkharwar000@gmail.com",
//     to: recipient,
//     subject: "Token of Appreciation",
//     text: `You have received a Token of Appreciation for the reason: ${reason}`,
//   };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// }

app.use("/api/users", userRoutes);
app.use("/api/token", toaRoutes);

// Error middleware

app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectdb(process.env.MONGODB);
});
