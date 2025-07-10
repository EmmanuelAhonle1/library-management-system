import { ValidationError } from "../Errors/GeneralError.js";
import ItemClassesExports from "../Items/Item.js";
import FormatValidator from "../Format Validator/FormatValidator.js";

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
      if (FormatValidator.isNameValid(firstName)) {
        //TODO: Replace with ClientRepository code for setting user first name

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
      if (FormatValidator.isNameValid(lastName)) {
        //TODO: Replace with ClientRepository code for setting user last name
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
      //TODO: Replace with ClientRepository code for storing the hashed password
    } catch (error) {
      console.error(error);
    }
  }

  setCreatedDate(createdDate) {
    try {
      if (FormatValidator.validateDatetime(createdDate)) {
        //TODO: Replace with ClientRepository code for setting created date
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
        //TODO: Replace with ClientRepository code for updating last login date
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
        //TODO: Replace with ClientRepository code for setting user ID
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
        //TODO: Replace with ClientRepository code for setting active status
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
        //TODO: Replace with ClientRepository code for setting email
        this.email = email;
      } else {
        throw new ValidationError(`'${email}' is an invalid Email format`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default User;
