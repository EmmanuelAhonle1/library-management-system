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

  // Validates transaction ID: 2-5 lowercase letters, dash, 12 alphanumeric characters
  static isValidTransactionID = /^[a-z]{2,5}-[A-Za-z0-9]{12}$/;
  static validateTransactionID(transactionID) {
    return this.isValidTransactionID.test(transactionID);
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

  // Additional frontend-specific validations

  // Validates password: minimum 6 characters
  static validatePassword(password) {
    return password && password.length >= 6;
  }

  // Validates that two passwords match
  static validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
  }

  // Validates required field (not empty or just whitespace)
  static validateRequired(value) {
    return value && value.toString().trim().length > 0;
  }
}

export default FormatValidator;
