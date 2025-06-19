import Repository from "./Repository";
import Client from "../Users/Client";
import FormatValidator from "../Format Validator/FormatValidator";

import { ClientTransactions } from "../Transactions/Transaction";

class ClientRepository extends Repository {
  constructor() {
    super();
  }

  createClient(client) {}

  findClient(clientID) {}

  updateClient(clientID, contentToUpdate) {}

  getCheckoutItems(clientID) {}

  addCheckoutItem(clientID, itemID) {}

  getOverdueItems(clientID) {}

  getUserHoldItems(clientID) {}

  // Individual functions for each transaction type
  async checkoutItem(clientID, itemID) {
    const transaction = new ClientTransactions.CheckOutTransaction(
      clientID,
      itemID
    );
    // Add checkout-specific validation/logic here
    return this.buildAndExecuteTransaction(transaction);
  }

  async returnItem(clientID, itemID) {
    const transaction = new ClientTransactions.ReturnTransaction(
      clientID,
      itemID
    );
    // Add return-specific validation/logic here (e.g., calculate late fees)
    return this.buildAndExecuteTransaction(transaction);
  }

  async holdItem(clientID, itemID) {
    const transaction = new ClientTransactions.HoldTransaction(
      clientID,
      itemID
    );
    // Add hold-specific validation/logic here (e.g., check if item is available)
    return this.buildAndExecuteTransaction(transaction);
  }

  async cancelHold(clientID, itemID) {
    // TODO: Create CancelHoldTransaction class
    // const transaction = new ClientTransactions.CancelHoldTransaction(clientID, itemID);
    // return this.buildAndExecuteTransaction(transaction);
  }

  async renewItem(clientID, itemID) {
    // TODO: Create RenewalTransaction class
    // const transaction = new ClientTransactions.RenewalTransaction(clientID, itemID);
    // return this.buildAndExecuteTransaction(transaction);
  }

  // Generic helper method for executing transactions
  async buildAndExecuteTransaction(transaction) {
    try {
      await this.db.initConnection();
      let query = `INSERT INTO item_transactions
      (transaction_id, client_id, item_id, transaction_type)
      VALUES (?, ?, ?, ?)`;

      let params = [
        transaction.transactionID,
        transaction.userID,
        transaction.itemID,
        transaction.transactionType,
      ];

      const results = await this.db.executeQuery(query, params);
      return results;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }
}

export default ClientRepository;
