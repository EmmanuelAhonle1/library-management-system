import DatabaseHandler from "../DatabaseHandler/DatabaseHandler.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
DatabaseHandler;

class Repository {
  db;
  constructor() {
    this.db = new DatabaseHandler(
      process.env.DATABASE_HOST,
      process.env.DATABASE_USER,
      process.env.DATABASE_PASSWORD,
      process.env.DATABASE_NAME,
      process.env.DATABASE_PORT
    );
  }
}

export default Repository;
