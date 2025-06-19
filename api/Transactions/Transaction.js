//Client Transactions
import CheckInTransaction from "./Client Transactions/CheckInTransaction";
import CheckOutTransaction from "./Client Transactions/CheckOutTransaction";
import HoldTransaction from "./Client Transactions/HoldTransaction";

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
  ["exp", "hold_expired"],
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
}

ClientTransactions = {
  CheckInTransaction,
  CheckOutTransaction,
  HoldTransaction,
};

LibrarianTransactions = {
  AddItemTransaction,
  DeleteItemTransaction,
  UpdateItemTransaction,
};

export default Transaction;

export { ClientTransactions, LibrarianTransactions };
