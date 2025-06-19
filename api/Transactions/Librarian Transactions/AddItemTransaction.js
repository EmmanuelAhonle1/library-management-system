import Transaction from "../Transaction";

class AddItemTransaction extends Transaction {
  static transactionPrefix = "add";
  constructor(userID, itemID) {
    super(userID, itemID, this.transactionPrefix);
  }
}

export default AddItemTransaction;
