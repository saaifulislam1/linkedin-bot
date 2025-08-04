import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  getArchivedPosts,
  archivePost,
  getActivePosts,
} from "./services/sheetService.js";
import { startScheduler } from "./services/scheduler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve frontend files

startScheduler();

// New route: get active posts
app.get("/posts", async (req, res) => {
  try {
    const activePosts = await getActivePosts();
    res.json(activePosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch active posts" });
  }
});

// Route to get archived posts
app.get("/archive", async (req, res) => {
  try {
    const archivedPosts = await getArchivedPosts();
    res.json(archivedPosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch archived posts" });
  }
});

// Route to archive a post
app.post("/archive/:timestamp", async (req, res) => {
  try {
    const { timestamp } = req.params;
    await archivePost(timestamp);
    res.json({ message: "Post archived" });
  } catch (error) {
    res.status(500).json({ error: "Failed to archive post" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
