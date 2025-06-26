import Transaction from "../Transaction.js";

class CheckOutTransaction extends Transaction {
  static transactionPrefix = "chk";
  constructor(userID, itemID) {
    super(userID, itemID, CheckOutTransaction.transactionPrefix);
  }
}

export default CheckOutTransaction;
