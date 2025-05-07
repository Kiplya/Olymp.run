import pool from "../pool";

export const checkDbConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Successfully connected to the database");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  }
};
