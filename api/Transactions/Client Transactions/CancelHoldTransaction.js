import Transaction from "../Transaction";

class CancelHoldTransaction extends Transaction {
  static transactionPrefix = "chl";
  constructor(userID, itemID) {
    super(userID, itemID, CancelHoldTransaction.transactionPrefix);
  }
}

export default CancelHoldTransaction;
