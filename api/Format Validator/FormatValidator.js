class FormatValidator {
  // Validates name: letters, hyphens and underscores only, min 2 characters
  static isValidName = /^[a-zA-Z_-]{2,}$/;
  static validateName(name) {
    return this.isValidName.test(name);
  }

  // Validates userID: 2-5 lowercase letters, dash, 6 numbers
  static isValidUserID = /^[a-z]{2,5}-[0-9]{6}$/;
  static validateUserID(userID) {
    return this.isValidUserID.test(userID);
  }

  // Validates email: requires text@domain.tld format with no spaces
  static isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  static validateEmail(email) {
    return this.isValidEmail.test(email);
  }

  // Validates datetime format: YYYY-MM-DD hh:mm:ss
  static isValidDatetimeFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  static validateDatetime(datetime) {
    return this.isValidDatetimeFormat.test(datetime);
  }

  static validateBoolean(value) {
    return typeof value === "boolean";
  }
}

export default FormatValidator;
