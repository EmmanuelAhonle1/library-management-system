import Repository from "./Repository";
import Client from "../Users/Client";
import FormatValidator from "../Format Validator/FormatValidator";
import UserRepository from "./UserRepository";

import Transaction, { ClientTransactions } from "../Transactions/Transaction";

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
    const transaction = new ClientTransactions.CheckOutTransaction(
      clientID,
      itemID
    );
    // Add checkout-specific validation/logic here
    return Transaction.buildAndExecuteTransaction(transaction);
  }

  async returnItem(clientID, itemID) {
    const transaction = new ClientTransactions.ReturnTransaction(
      clientID,
      itemID
    );
    // Add return-specific validation/logic here (e.g., calculate late fees)
    return Transaction.buildAndExecuteTransaction(transaction);
  }

  async holdItem(clientID, itemID) {
    const transaction = new ClientTransactions.HoldTransaction(
      clientID,
      itemID
    );
    // Add hold-specific validation/logic here (e.g., check if item is available)
    return Transaction.buildAndExecuteTransaction(transaction);
  }
  async cancelHold(clientID, itemID) {
    const transaction = new ClientTransactions.CancelHoldTransaction(
      clientID,
      itemID
    );
    // Add cancel hold-specific validation/logic here
    return Transaction.buildAndExecuteTransaction(transaction);
  }

  async renewItem(clientID, itemID) {
    // TODO: Create RenewalTransaction class
    const transaction = new ClientTransactions.RenewalTransaction(
      clientID,
      itemID
    );
    return Transaction.buildAndExecuteTransaction(transaction);
  }
}

export default ClientRepository;
