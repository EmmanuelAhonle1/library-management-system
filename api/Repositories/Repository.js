import DatabaseHandler from "../DatabaseHandler/DatabaseHandler.js";
import dotenv from "dotenv";

dotenv.config();
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
