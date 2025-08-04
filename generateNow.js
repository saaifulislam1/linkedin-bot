import { generateAndSavePosts } from "./utils/postGenerator.js";

generateAndSavePosts().then(() => {
  console.log("✅ Manual post generation completed.");
});
