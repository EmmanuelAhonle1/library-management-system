import Transaction from "../Transaction";

class UpdateItemTransaction extends Transaction {
  static transactionPrefix = "upd";
  constructor(userID, itemID) {
    super(userID, itemID, UpdateItemTransaction.transactionPrefix);
  }
}

export default UpdateItemTransaction;
