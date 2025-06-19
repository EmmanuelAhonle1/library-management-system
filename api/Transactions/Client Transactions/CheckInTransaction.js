import Transaction from "../Transaction";

class CheckInTransaction extends Transaction {
  static transactionPrefix = "ret";
  constructor(userID, itemID) {
    super(userID, itemID, this.transactionPrefix);
  }
}

export default CheckInTransaction;
