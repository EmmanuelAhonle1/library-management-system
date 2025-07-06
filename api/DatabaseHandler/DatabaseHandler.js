import mysql from "mysql2";

/**
 * Database Handler Class for MySQL
 * Manages database connections and query execution for MySQL databases using Node.js mysql package
 */
class DatabaseHandler {
  // Private properties
  #host;
  #user;
  #password;
  #database;
  #port;
  #query;
  #pool;

  /**
   * Constructor for DatabaseHandler
   * @param {string} host - MySQL host address
   * @param {string} user - MySQL username
   * @param {string} password - MySQL password
   * @param {string} database - MySQL database name
   * @param {number} port - MySQL port (default: 3306)
   */
  constructor(host, user, password, database, port) {
    this.#host = host;
    this.#user = user;
    this.#password = password;
    this.#database = database;
    this.#port = port;
    this.#query = "";
    this.#pool = null;
  }

  /**
   * Initializes the database connection pool
   * @returns {Promise<boolean>} - Promise resolving to connection status
   */
  async initConnection() {
    try {
      // Import the mysql package

      // Create a connection pool
      this.#pool = mysql.createPool({
        host: this.#host,
        user: this.#user,
        password: this.#password,
        database: this.#database,
        port: this.#port,
        connectionLimit: 10,
      });

      // Test the connection
      return new Promise((resolve, reject) => {
        this.#pool.query("SELECT 1 AS connection_test", (error, results) => {
          if (error) {
            console.error("Failed to connect to MySQL database:", error);
            reject(error);
            return;
          }
          console.log(
            `Successfully connected to MySQL database at ${this.#host}`
          );
          resolve(true);
        });
      });
    } catch (error) {
      console.error("Failed to initialize MySQL connection:", error);
      throw error;
    }
  }

  /**
   * Executes a SQL query against the MySQL database
   * @param {string} query - SQL query to execute
   * @param {Array} params - Query parameters for prepared statements
   * @returns {Promise<Object>} - Promise resolving to query results
   */
  async executeQuery(query, params = []) {
    // Ensure connection pool is established
    if (!this.#pool) {
      await this.initConnection();
    }

    this.#query = query;

    // Execute the query with parameters
    return new Promise((resolve, reject) => {
      this.#pool.query(this.#query, params, (error, results) => {
        if (error) {
          console.error("Error executing MySQL query:", error);
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  }

  /**
   * Executes a transaction with multiple queries
   * @param {Array<{query: string, params: Array}>} queries - Array of query objects
   * @returns {Promise<boolean>} - Promise resolving to transaction success status
   */
  async executeTransaction(queries) {
    // Ensure connection pool is established
    if (!this.#pool) {
      await this.initConnection();
    }

    return new Promise((resolve, reject) => {
      // Get a connection for the transaction
      this.#pool.getConnection((connectionError, connection) => {
        if (connectionError) {
          console.error(
            "Error getting connection for transaction:",
            connectionError
          );
          reject(connectionError);
          return;
        }

        // Begin transaction
        connection.beginTransaction(async (beginError) => {
          if (beginError) {
            connection.release();
            console.error("Error beginning transaction:", beginError);
            reject(beginError);
            return;
          }

          try {
            // Execute each query in sequence
            for (const queryObj of queries) {
              await new Promise((resolveQuery, rejectQuery) => {
                connection.query(
                  queryObj.query,
                  queryObj.params || [],
                  (queryError, results) => {
                    if (queryError) {
                      rejectQuery(queryError);
                      return;
                    }
                    resolveQuery(results);
                  }
                );
              });
            }

            // If all queries succeeded, commit the transaction
            connection.commit((commitError) => {
              if (commitError) {
                return connection.rollback(() => {
                  connection.release();
                  reject(commitError);
                });
              }

              connection.release();
              resolve(true);
            });
          } catch (error) {
            // If any query fails, rollback the transaction
            connection.rollback(() => {
              connection.release();
              console.error("Transaction rolled back:", error);
              reject(error);
            });
          }
        });
      });
    });
  }

  /**
   * Closes the database connection pool
   * @returns {Promise<void>}
   */
  async closeConnection() {
    if (this.#pool) {
      return new Promise((resolve, reject) => {
        this.#pool.end((error) => {
          if (error) {
            console.error("Error closing MySQL connection pool:", error);
            reject(error);
            return;
          }
          console.log("MySQL connection pool closed");
          resolve();
        });
      });
    }
  }
}

export default DatabaseHandler;
