import express from "express";
import { createTOA, getAllAllottedTOA, getAllTOA } from "../controllers/toa.js";

const router = express.Router();

// Define routes
// router.get("/toa", getAllTOAs);
router.post("/", createTOA);
router.get("/", getAllTOA);
router.get("/allotedbyu", getAllAllottedTOA);

export default router;
