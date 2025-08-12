// scheduler/scheduler.js
import cron from "node-cron";
import { generateAndSavePosts } from "../utils/postGenerator.js";

export function startScheduler() {
  cron.schedule(
    "57 10 * * *", // Runs every day at 11:40 AM Dhaka time
    () => {
      console.log("🕘 Running scheduled job at 9:00 AM Dhaka time");
      generateAndSavePosts();
    },
    {
      timezone: "Asia/Dhaka",
    }
  );
  //   cron.schedule("* * * * *", () => {
  //     console.log("🧪 Test job running every minute...");
  //     generateAndSavePosts();
  //   });
}
