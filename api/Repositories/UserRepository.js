import Repository from "./Repository";

class UserRepository extends Repository {
  constructor() {
    super();
  }

  createUser(user) {}

  findUser(userID) {}

  updateUser(userID, contentToUpdate) {}

  getUserCheckoutItems(userID) {}

  getUserOverdueItems(userID) {}

  getUserHoldItems(userID) {}

  getUserCheckoutItem(itemID) {}

  getCheckInItem(itemID) {}
}
