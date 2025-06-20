import Transaction from "../Transaction";

class RenewalTransaction extends Transaction {
  static transactionPrefix = "rnw";
  constructor(userID, itemID) {
    super(userID, itemID, RenewalTransaction.transactionPrefix);
  }
}

export default RenewalTransaction;
