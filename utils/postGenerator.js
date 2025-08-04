// utils/postGenerator.js
import topics from "../data/topics.js";
import { generatePost, summarizePost } from "../services/openaiService.js";
import { appendPostToSheet } from "../services/sheetService.js";

function pickRandomTopics(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function generateAndSavePosts() {
  const selectedTopics = pickRandomTopics(topics, 5);

  for (const topic of selectedTopics) {
    try {
      const post = await generatePost(topic);
      const postSummary = await summarizePost(post);
      const timestamp = new Date().toISOString();
      await appendPostToSheet(timestamp, topic, post, "ACTIVE", postSummary);
      console.log(`✅ Posted about: ${topic}`);
    } catch (err) {
      console.error(`❌ Error processing topic "${topic}":`, err.message);
    }
  }
}
