import Transaction from "../Transaction";

class DeleteItemTransaction extends Transaction {
  static transactionPrefix = "del";
  constructor(userID, itemID) {
    super(userID, itemID, DeleteItemTransaction.transactionPrefix);
  }
}

export default DeleteItemTransaction;
