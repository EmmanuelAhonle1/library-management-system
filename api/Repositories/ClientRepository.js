import Repository from "./Repository";
import Client from "../Users/Client";
class ClientRepository extends Repository {
  constructor() {
    super();
  }

  createClient(client) {}

  findClient(clientID) {}

  updateClient(clientID, contentToUpdate) {}

  getCheckoutItems(clientID) {}

  getOverdueItems(clientID) {}

  getUserHoldItems(clientID) {}

  getUserCheckoutItem(itemID) {}

  getCheckInItem(itemID) {}
}
