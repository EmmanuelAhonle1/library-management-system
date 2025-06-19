import Transaction from "../Transaction";

class AddItemTransaction extends Transaction {
  static transactionPrefix = "add";
  constructor(userID, itemID) {
    super(userID, itemID, AddItemTransaction.transactionPrefix);
  }
}

export default AddItemTransaction;
