import User from "./User";

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

  setOverdueTransactions() {
    //TODO: Replace with UserRepository code for calculating and setting overdue transactions
    this.currentCheckouts.forEach((element) => {
      // TODO: complete set overdue transactions
    });
  }

  //TODO: Replace with UserRepository code for handling checkouts
  checkoutItem(item) {
    //TODO: Implement checkout functionality with UserRepository
  }

  //TODO: Replace with UserRepository code for handling returns
  returnItem(item) {
    //TODO: Implement return functionality with UserRepository
  }

  //TODO: Replace with UserRepository code for placing holds
  placeHold(item) {
    //TODO: Implement hold placement functionality with UserRepository
  }

  //TODO: Replace with UserRepository code for fetching transaction history
  getTransactionHistory() {
    //TODO: Implement transaction history retrieval with UserRepository
  }
}

export default Client;
