import Transaction from "../Transaction";

class CheckOutTransaction extends Transaction {
  constructor(transactionID, transactionDate, status, userID, userType) {
    this.transactionPrefix = "";
  }
}

export default CheckOutTransaction;
