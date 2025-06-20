import Repository from "./Repository.js";
import { AbstractionError } from "../Exceptions/Exception.js";

class UserRepository extends Repository {
  constructor() {
    super();
    // Prevent direct instantiation of abstract class
    if (this.constructor === UserRepository) {
      throw new AbstractionError(
        "Abstract class UserRepository cannot be instantiated directly"
      );
    }
  }

  // User-related data operations (abstract methods)
  createUser(userData) {
    throw new AbstractionError(
      "createUser() method must be implemented in derived class"
    );
  }

  findUser(userID) {
    throw new AbstractionError(
      "findUser() method must be implemented in derived class"
    );
  }

  updateUser(userID, updateData) {
    throw new AbstractionError(
      "updateUser() method must be implemented in derived class"
    );
  }

  deleteUser(userID) {
    throw new AbstractionError(
      "deleteUser() method must be implemented in derived class"
    );
  }
}

export default UserRepository;
