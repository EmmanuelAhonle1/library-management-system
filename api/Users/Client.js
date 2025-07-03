import User from "./User.js";

class Client extends User {
  currentCheckouts;
  currentHolds;
  overdueTransactions;
  transactionHistory;

  constructor(
    userID,
    firstName,
    lastName,
    email,
    passwordHash,
    isActive,
    createdDate,
    lastLoginDate,
    currentCheckouts,
    currentHolds,
    transactionHistory
  ) {
    super(
      userID,
      firstName,
      lastName,
      email,
      passwordHash,
      isActive,
      createdDate,
      lastLoginDate
    );
    this.currentCheckouts = currentCheckouts;
    this.currentHolds = currentHolds;
    this.transactionHistory = transactionHistory;
  }
}

export default Client;
