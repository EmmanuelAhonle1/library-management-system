import Repository from "./Repository.js";
import { AbstractionError } from "../Errors/GeneralError.js";

class UserRepository extends Repository {
  constructor() {
    super();
    // Prevent direct instantiation of abstract class
    if (this.constructor === UserRepository) {
      throw new AbstractionError(
        "Abstract class UserRepository cannot be instantiated directly"
      );
    }
  } // User-related data operations

  /**
   * Creates a new user in the appropriate table (abstract method)
   * @param {Object} userData - User data object containing user information
   * @returns {Promise<Object>} Promise resolving to creation result
   * @throws {AbstractionError} Must be implemented in derived class
   */
  async createUser(userData) {
    throw new AbstractionError(
      "createUser() method must be implemented in derived class"
    );
  }

  /**
   * Finds a user by their ID across client and librarian tables
   * @param {string} userID - User ID with format prefix-number (e.g., "cli-123456", "libra-789012")
   * @returns {Promise<Object>} Promise resolving to user data or error object
   */
  async findUser(userID) {
    try {
      let [userTableName, idColumnName] =
        this.#createTableAndColumnNames(userID);

      await this.db.initConnection();
      let query = `SELECT * FROM ${userTableName} 
      WHERE ${idColumnName} = ?`;

      let params = [userID];

      const results = await this.db.executeQuery(query, params);
      return results;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }

  /**
   * Updates a user's information in the appropriate table
   * @param {string} userID - User ID with format prefix-number (e.g., "cli-123456", "libra-789012")
   * @param {Map} updateData - Map containing field names as keys and new values as values
   * @returns {Promise<Object>} Promise resolving to update result or error object
   */
  async updateUser(userID, updateData) {
    try {
      let [userTableName, idColumnName] =
        this.#createTableAndColumnNames(userID);

      await this.db.initConnection();

      let [requirements, values] = this.updateBuilder(updateData);

      let query = `UPDATE ${userTableName}

      ${requirements}
      WHERE ${idColumnName} = ?`;

      let params = [...values, userID];

      const results = await this.db.executeQuery(query, params);
      return results;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }

  /**
   * Deletes a user from the appropriate table
   * @param {string} userID - User ID with format prefix-number (e.g., "cli-123456", "libra-789012")
   * @returns {Promise<Object>} Promise resolving to deletion result or error object
   */
  async deleteUser(userID) {
    try {
      let [userTableName, idColumnName] =
        this.#createTableAndColumnNames(userID);

      await this.db.initConnection();

      let query = `DELETE FROM ${userTableName}
        WHERE ${idColumnName} = ?`;
      let params = [userID];

      const results = await this.db.executeQuery(query, params);
      return results;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }

  // Helper methods

  /**
   * Helper method to build dynamic UPDATE SQL SET clause from Map data
   * @private
   * @param {Map} updateData - Map containing field names as keys and values to update
   * @returns {Array} Array containing [requirements string, values array] for SQL query
   */
  updateBuilder(updateData) {
    const [keys, values] = [
      Array.from(updateData.keys()),
      Array.from(updateData.values()),
    ];

    let requirements = "SET ";

    keys.forEach((key) => {
      requirements += `${key} = ?,`;
    });

    if (requirements[requirements.length - 1] === ",") {
      requirements = requirements.slice(0, requirements.length - 1);
    }

    return [requirements, values];
  }

  /**
   * Helper method to determine table and column names based on user ID prefix
   * @private
   * @param {string} userID - User ID with format prefix-number (e.g., "cli-123456", "libra-789012", "admin-789012")
   * @returns {Array} Array containing [tableName, columnName] - e.g., ["clients", "client_id"] or ["librarians", "librarian_id"]
   * @usage Used internally to route database operations to correct table based on user type
   */
  #createTableAndColumnNames(userID) {
    let userTableName;
    let idColumnName;

    let indexOfHyphen = userID.indexOf("-");
    let idPrefix = userID.slice(0, indexOfHyphen);

    switch (idPrefix) {
      case "cli":
        userTableName = "clients";
        idColumnName = "client_id";
        break;

      case "libra":
        userTableName = "librarians";
        idColumnName = "librarian_id";
        break;

      case "admin":
        userTableName = "librarians";
        idColumnName = "librarian_id";
        break;
    }

    return [userTableName, idColumnName];
  }
}

export default UserRepository;
