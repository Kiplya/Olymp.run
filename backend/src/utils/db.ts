import pool from "../pool";
import { judgeApi } from "../handlers";

export const checkDbConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Successfully connected to the database");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  }

  try {
    await judgeApi.get(`/languages`);
    console.log("Successfully connected to the Judge0");
  } catch (err) {
    console.error("Failed to connect to the Judge0:", err);
    process.exit(1);
  }
};
