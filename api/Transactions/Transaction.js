//Client Transactions
import CheckOutTransaction from "./Client Transactions/CheckOutTransaction";
import HoldTransaction from "./Client Transactions/HoldTransaction";
import ReturnTransaction from "./Client Transactions/ReturnTransaction";
import CancelHoldTransaction from "./Client Transactions/CancelHoldTransaction";
import RenewalTransaction from "./Client Transactions/RenewalTransaction";
//Librarian Transactions
import AddItemTransaction from "./Librarian Transactions/AddItemTransaction";
import DeleteItemTransaction from "./Librarian Transactions/DeleteItemTransaction";
import UpdateItemTransaction from "./Librarian Transactions/UpdateItemTransaction";

// Client Transaction Prefixes
const CLIENT_TRANSACTION_PREFIXES = new Map([
  ["chk", "checkout"],
  ["ret", "return"],
  ["hld", "hold"],
  ["chl", "cancel_hold"],
  ["rnw", "renewal"],
]);

// Librarian Transaction Prefixes
const LIBRARIAN_TRANSACTION_PREFIXES = new Map([
  ["add", "item_added"],
  ["upd", "item_updated"],
  ["del", "item_deleted"],
]);

// Combined Transaction Prefixes
const TRANSACTION_PREFIXES = new Map([
  ...CLIENT_TRANSACTION_PREFIXES,
  ...LIBRARIAN_TRANSACTION_PREFIXES,
]);

class Transaction {
  transactionID;
  userID;
  itemID;
  transactionType;
  transactionPrefix;

  constructor(userID, itemID, transactionPrefix = "") {
    this.userID = userID;
    this.itemID = itemID;
    this.transactionPrefix = transactionPrefix;
    this.transactionType = TRANSACTION_PREFIXES.get(this.transactionPrefix);
    this.transactionID = this.generateTransactionID(this.transactionPrefix);
  }

  /**
   * Generates a unique transaction ID with the specified prefix
   * @param {string} transactionPrefix - The 3-letter prefix for the transaction type (e.g., "chk", "ret", "hld", "add", "del")
   * @returns {string} A unique transaction ID in format: "prefix-randomString" (e.g., "chk-abc123def456")
   * @example
   * generateTransactionID("chk") // Returns: "chk-x7k9m2n4p8q1"
   * generateTransactionID("ret") // Returns: "ret-a1b2c3d4e5f6"
   * generateTransactionID("add") // Returns: "add-z9y8x7w6v5u4"
   */
  generateTransactionID(transactionPrefix) {
    // Generate 12 random alphanumeric characters (lowercase)
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < 12; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    // Return format: prefix-randomString (e.g., "chk-abc123def456")
    return `${transactionPrefix}-${randomString}`;
  }

  /**
   * Executes a transaction by inserting it into the item_transactions table
   * @param {Transaction} transaction - The transaction object containing all transaction details
   * @returns {Promise<Object>} Promise resolving to database execution result or error object
   * @throws {Error} Database connection or query execution errors
   * @example
   * const transaction = new CheckOutTransaction("cli-100001", "book-200001");
   * const result = await buildAndExecuteTransaction(transaction);
   * // Returns: { insertId: 123, affectedRows: 1 } or { success: false, error: "..." }
   */
  static async buildAndExecuteTransaction(transaction) {
    try {
      let db = new DatabaseHandler(
        process.env.DATABASE_HOST,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        process.env.DATABASE_NAME,
        process.env.DATABASE_PORT
      );
      await db.initConnection();
      let query = `INSERT INTO item_transactions
      (transaction_id, client_id, item_id, transaction_type)
      VALUES (?, ?, ?, ?)`;

      let params = [
        transaction.transactionID,
        transaction.userID,
        transaction.itemID,
        transaction.transactionType,
      ];

      const results = await db.executeQuery(query, params);
      return results;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await db.closeConnection();
    }
  }
}

const ClientTransactions = {
  ReturnTransaction,
  CheckOutTransaction,
  HoldTransaction,
  CancelHoldTransaction,
  RenewalTransaction,
};

const LibrarianTransactions = {
  AddItemTransaction,
  DeleteItemTransaction,
  UpdateItemTransaction,
};

export default Transaction;

export { ClientTransactions, LibrarianTransactions };
