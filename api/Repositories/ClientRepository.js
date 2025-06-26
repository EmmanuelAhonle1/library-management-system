import Repository from "./Repository";
import Client from "../Users/Client";
import FormatValidator from "../Format Validator/FormatValidator";
import UserRepository from "./UserRepository";

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
}

export default ClientRepository;
