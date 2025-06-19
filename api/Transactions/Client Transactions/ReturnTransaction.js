import Transaction from "../Transaction";

class ReturnTransaction extends Transaction {
  static transactionPrefix = "ret";
  constructor(userID, itemID) {
    super(userID, itemID, ReturnTransaction.transactionPrefix);
  }
}

export default ReturnTransaction;
