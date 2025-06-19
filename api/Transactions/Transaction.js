//Client Transactions
import CheckInTransaction from "./Client Transactions/CheckInTransaction";
import CheckOutTransaction from "./Client Transactions/CheckOutTransaction";
import HoldTransaction from "./Client Transactions/HoldTransaction";

//Librarian Transactions
import AddItemTransaction from "./Librarian Transactions/AddItemTransaction";
import DeleteItemTransaction from "./Librarian Transactions/DeleteItemTransaction";
import UpdateItemTransaction from "./Librarian Transactions/UpdateItemTransaction";

class Transaction {
  transactionID;
  transactionDate;
  status;
  userID;
  userType;
  transactionPrefix;

  constructor(transactionID, transactionDate, status, userID, userType) {
    this.transactionID = transactionID;
    this.transactionDate = transactionDate;
    this.status = status;
    this.userID = userID;
    this.userType = userType;
    this.transactionPrefix = "";
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
