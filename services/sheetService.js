import { google } from "googleapis";
import "dotenv/config";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY, // Remove the .replace() since you have actual newlines
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Sheet1"; // Adjust if your sheet name is different

// ✅ Append a new post with default status "ACTIVE"
export async function appendPostToSheet(
  timestamp,
  topic,
  post,
  status = "ACTIVE",
  postSummary = ""
) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[timestamp, topic, post, status, postSummary]],
      },
    });
  } catch (error) {
    console.error("Error appending post to sheet:", error);
    throw error;
  }
}

// ✅ Get archived posts only (where status is ARCHIVED)
export async function getArchivedPosts() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:D`,
    });

    const rows = res.data.values || [];

    const archivedPosts = rows
      .filter((row) => row[3] && row[3].toUpperCase() === "ARCHIVED")
      .map(([timestamp, topic, post]) => ({ timestamp, topic, post }));

    return archivedPosts;
  } catch (error) {
    console.error("Error fetching archived posts:", error);
    throw error;
  }
}

// ✅ Archive a post by setting status to "ARCHIVED" using timestamp
export async function archivePost(timestamp) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:D`,
    });

    const rows = res.data.values || [];

    const rowIndex = rows.findIndex((row) => row[0] === timestamp);
    if (rowIndex === -1) throw new Error("Post not found");

    const sheetRow = rowIndex + 2; // Sheet rows start at 1 + header

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!D${sheetRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["ARCHIVED"]],
      },
    });
  } catch (error) {
    console.error("Error archiving post:", error);
    throw error;
  }
}

// ✅ Optionally get all active posts (not archived)
export async function getActivePosts() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:D`,
    });

    const rows = res.data.values || [];

    const activePosts = rows
      .filter((row) => !row[3] || row[3].toUpperCase() !== "ARCHIVED")
      .map(([timestamp, topic, post]) => ({ timestamp, topic, post }));

    return activePosts;
  } catch (error) {
    console.error("Error fetching active posts:", error);
    throw error;
  }
}
