import Transaction from "../Transaction";

class UpdateItemTransaction extends Transaction {
  static transactionPrefix = "upd";
  constructor(userID, itemID) {
    super(userID, itemID, this.transactionPrefix);
  }
}

export default UpdateItemTransaction;
