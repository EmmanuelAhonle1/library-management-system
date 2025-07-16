import Client from "../Users/Client.js";
import FormatValidator from "../Format Validator/FormatValidator.js";
import UserRepository from "./UserRepository.js";
class ClientRepository extends UserRepository {
  constructor() {
    super();
  }

  async getCheckoutItems(clientID) {
    try {
      await this.db.initConnection();
      let query = `SELECT DISTINCT checkout_trans.*
        FROM item_transactions AS checkout_trans
        LEFT JOIN item_transactions AS return_trans 
        ON checkout_trans.client_id = return_trans.client_id 
        AND checkout_trans.item_id = return_trans.item_id
        AND return_trans.transaction_type = 'return'
        AND return_trans.status = 'completed'
        WHERE checkout_trans.transaction_type = 'checkout'
        AND checkout_trans.client_id = ?
        AND checkout_trans.status = 'completed'
        AND return_trans.transaction_id IS NULL;`;

      let params = [clientID];

      const results = await this.db.executeQuery(query, params);
      return results;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }

  async getOverdueItems(clientID) {
    try {
      await this.db.initConnection();
      let query = `SELECT DISTINCT checkout_trans.*
        FROM item_transactions AS checkout_trans
        LEFT JOIN item_transactions AS return_trans 
        ON checkout_trans.client_id = return_trans.client_id 
        AND checkout_trans.item_id = return_trans.item_id
        AND return_trans.transaction_type = 'return'
        AND return_trans.status = 'completed'
        WHERE checkout_trans.transaction_type = 'checkout'
        AND checkout_trans.client_id = ?
        AND return_trans.transaction_id IS NULL
        AND checkout_trans.status = 'overdue';`;

      let params = [clientID];

      const results = await this.db.executeQuery(query, params);
      return results;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }

  async getHoldItems(clientID) {
    try {
      await this.db.initConnection();
      let query = `SELECT DISTINCT hold_trans.*
        FROM item_transactions AS hold_trans
        LEFT JOIN item_transactions AS cancel_hold_trans 
        ON hold_trans.client_id = cancel_hold_trans.client_id 
        AND hold_trans.item_id = cancel_hold_trans.item_id
        AND cancel_hold_trans.transaction_type = 'cancel_hold'
        AND cancel_hold_trans.status = 'cancelled'
        WHERE hold_trans.transaction_type = 'hold'
        AND hold_trans.client_id = ?
        AND hold_trans.status = 'active'
        AND cancel_hold_trans.transaction_id IS NULL;`;

      let params = [clientID];

      const results = await this.db.executeQuery(query, params);
      return results;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }
  async checkoutItem(clientID, itemID) {
    return this.executeClientTransaction(
      clientID,
      itemID,
      "checkout",
      "chk",
      "Item checked out successfully"
    );
  }

  async returnItem(clientID, itemID) {
    return this.executeClientTransaction(
      clientID,
      itemID,
      "return",
      "ret",
      "Item returned successfully"
    );
  }

  async holdItem(clientID, itemID) {
    return this.executeClientTransaction(
      clientID,
      itemID,
      "hold",
      "hld",
      "Item placed on hold successfully"
    );
  }

  async cancelHold(clientID, itemID) {
    return this.executeClientTransaction(
      clientID,
      itemID,
      "cancel_hold",
      "chl",
      "Hold cancelled successfully"
    );
  }

  async renewItem(clientID, itemID) {
    return this.executeClientTransaction(
      clientID,
      itemID,
      "renewal",
      "rnw",
      "Item renewed successfully"
    );
  }

  // Helper method to execute client transactions
  async executeClientTransaction(
    clientID,
    itemID,
    transactionType,
    prefix,
    successMessage
  ) {
    try {
      await this.db.initConnection();

      const transactionID = UserRepository.generateTransactionId(prefix);

      const query = `
        INSERT INTO item_transactions (transaction_id, client_id, item_id, transaction_type)
        VALUES (?, ?, ?, ?)
      `;

      const params = [transactionID, clientID, itemID, transactionType];
      const result = await this.db.executeQuery(query, params);

      return {
        success: true,
        transactionId: transactionID,
        message: successMessage,
        databaseResult: result,
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }

  // User management methods

  /**
   * Creates a new client user
   * @param {Object} userData - Client data object containing user information
   * @returns {Promise<Object>} Promise resolving to creation result
   */
  async createUser(userData) {
    try {
      // Validate required fields
      console.log(process.env.DATABASE_HOST);
      if (
        !userData.first_name ||
        !userData.last_name ||
        !userData.email ||
        !userData.password
      ) {
        return {
          success: false,
          error:
            "Missing required fields: first_name, last_name, email, and password are required",
        };
      }

      await this.db.initConnection();

      // Generate client ID
      const clientId = UserRepository.generateUserId("cli");

      // Set defaults for optional fields
      const clientDefaults = {
        is_active: true,
        ...userData,
        client_id: clientId,
      };

      const query = `
        INSERT INTO clients (
          client_id, first_name, last_name, email, password, is_active
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      const params = [
        clientDefaults.client_id,
        clientDefaults.first_name,
        clientDefaults.last_name,
        clientDefaults.email,
        clientDefaults.password, // Should be hashed in application layer
        clientDefaults.is_active,
      ];

      const result = await this.db.executeQuery(query, params);

      if (result.affectedRows === 0) {
        return { success: false, error: "Failed to create client" };
      }

      return {
        success: true,
        message: "Client created successfully",
        clientId: clientDefaults.client_id,
        insertId: result.insertId,
      };
    } catch (error) {
      // Handle duplicate key errors specifically
      if (error.code === "ER_DUP_ENTRY") {
        return {
          success: false,
          error: {
            message: "Client with this email already exists",
            code: "ER_DUP_ENTRY",
          },
        };
      } else {
        return {
          success: false,
          error: {
            message: "An error occurred while creating the client",
            details: error.message,
            code: "ER_DUP_ENTRY",
          },
        };
      }
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }
}

export default ClientRepository;
