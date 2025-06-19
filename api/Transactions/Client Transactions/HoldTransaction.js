import Transaction from "../Transaction";

class HoldTransaction extends Transaction {
  static transactionPrefix = "hld";
  constructor(userID, itemID) {
    super(userID, itemID, HoldTransaction.transactionPrefix);
  }
}

export default HoldTransaction;
