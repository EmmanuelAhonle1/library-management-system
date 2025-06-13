import { ValidationError } from "../Exceptions/Exception";
import Transaction from "../Transactions/Transaction";
import ItemClassesExports from "../Items/Item";
import FormatValidator from "../Format Validator/FormatValidator";
import DatabaseHandler from "../DatabaseHandler/DatabaseHandler";

class User {
  userID;
  firstName;
  lastName;
  email;
  isActive;

  #passwordHash;
  #createdDate;
  #lastLoginDate;

  constructor(
    userID,
    firstName,
    lastName,
    email,
    passwordHash,
    isActive,
    createdDate,
    lastLoginDate
  ) {
    this.userID = userID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.#passwordHash = passwordHash;
    this.isActive = isActive;
    this.#createdDate = createdDate;
    this.#lastLoginDate = lastLoginDate;
  }

  setFirstName(firstName) {
    try {
      if (FormatValidator.validateName(firstName)) {
        //TODO: Replace with UserRepository code for setting user first name
        this.firstName = firstName;
      } else {
        throw new ValidationError(
          `'${firstName} is an invalid first name format. First name should have min 2 characters, no spaces, and no numbers`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  setLastName(lastName) {
    try {
      if (FormatValidator.validateName(lastName)) {
        //TODO: Replace with UserRepository code for setting user last name
        this.firstName = lastName;
      } else {
        throw new ValidationError(
          `'${lastName} is an invalid last name format. First name should have min 2 characters, no spaces, and no numbers`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Password hashing utility function
  static hashPassword(password) {
    try {
      // Simple password validation
      if (!password || password.length < 8) {
        throw new ValidationError(
          "Password must be at least 8 characters long"
        );
      }

      // Create a salt (in production, use bcrypt library)
      const salt =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Hash the password (simplified version - in production use bcrypt)
      const crypto = require("crypto");
      const hash = crypto
        .createHash("sha256")
        .update(password + salt)
        .digest("hex");

      // Return the hashed password with salt
      return `${hash}.${salt}`;
    } catch (error) {
      console.error("Password hashing failed:", error);
      throw error;
    }
  }

  setPassword(password) {
    try {
      // Hash the password and store it
      this.#passwordHash = hashPassword(password);
      //TODO: Replace with UserRepository code for storing the hashed password
    } catch (error) {
      console.error(error);
    }
  }

  setCreatedDate(createdDate) {
    try {
      if (FormatValidator.validateDatetime(createdDate)) {
        //TODO: Replace with UserRepository code for setting created date
        this.#createdDate = createdDate;
      } else {
        throw new ValidationError(
          `'${createdDate}' is an invalid Datetime format. Should be: 'YYYY-MM-DD hh:mm:ss'`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  setLastLoginDate(lastLoginDate) {
    try {
      if (FormatValidator.validateDatetime(lastLoginDate)) {
        //TODO: Replace with UserRepository code for updating last login date
        this.#lastLoginDate = lastLoginDate;
      } else {
        throw new ValidationError(
          `'${lastLoginDate}' is an invalid Datetime format. Should be: 'YYYY-MM-DD hh:mm:ss'`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  setUserID(userID) {
    try {
      if (FormatValidator.validateUserID(userID)) {
        //TODO: Replace with UserRepository code for setting user ID
        this.userID = userID;
      } else {
        throw new ValidationError(
          `'${userID}' is an invalid User ID format. Format should be 1-5 capital letters, dash, 12 alphanumeric characters (e.g., 'ABCDE-a1b2c3d4e5f6')`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  setActiveStatus(isActive) {
    try {
      if (FormatValidator.validateBoolean(isActive)) {
        //TODO: Replace with UserRepository code for setting active status
        this.isActive = isActive;
      } else {
        throw new ValidationError(`Active status must be a boolean value`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  setEmail(email) {
    try {
      if (FormatValidator.validateEmail(email)) {
        //TODO: Replace with UserRepository code for setting email
        this.email = email;
      } else {
        throw new ValidationError(`'${email}' is an invalid Email format`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

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

class Librarian extends User {
  #itemEditHistory;

  constructor() {
    //TODO: Replace with UserRepository code for creating librarian users
  }

  addItemToCatalog() {
    //TODO: Replace with UserRepository code for adding items to catalog
  }

  //TODO: Replace with UserRepository code for removing items
  removeItemFromCatalog(item) {
    //TODO: Implement item removal functionality with UserRepository
  }

  //TODO: Replace with UserRepository code for modifying items
  modifyItemDetails(item, details) {
    //TODO: Implement item modification functionality with UserRepository
  }

  //TODO: Replace with UserRepository code for managing user accounts
  manageUserAccounts(user, action) {
    //TODO: Implement user account management functionality with UserRepository
  }

  //TODO: Replace with UserRepository code for viewing system logs
  viewSystemLogs() {
    //TODO: Implement system logs viewing functionality with UserRepository
  }
}

const UserExports = { Client, Librarian, User };
export default UserExports;
