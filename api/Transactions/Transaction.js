class Transaction {
  transactionID;
  transactionDate;
  status;
  userID;
  userType;

  constructor(transactionID, transactionDate, status, userID, userType) {
    this.transactionID = transactionID;
    this.transactionDate = transactionDate;
    this.status = status;
    this.userID = userID;
    this.userType = userType;
  }
}

export default { Transaction };
