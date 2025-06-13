import DatabaseHandler from "../DatabaseHandler/DatabaseHandler";

DatabaseHandler;

class Repository {
  db;

  constructor() {
    this.db = new DatabaseHandler(
      "localhost",
      "root",
      "pass",
      "library-management-system",
      3306
    );
  }
}

export default Repository;
