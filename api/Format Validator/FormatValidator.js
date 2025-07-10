class FormatValidator {
  // Validates name: letters, hyphens and underscores only, min 2 characters
  static name_format = /^[a-zA-Z_-]{2,}$/;
  static isValidName(name) {
    return this.name_format.test(name);
  }

  // Validates userID: 2-5 lowercase letters, dash, 6 numbers
  static userID_format = /^[a-z]{2,5}-[0-9]{6}$/;
  static isValidUserID(userID) {
    return this.userID_format.test(userID);
  }

  // Validates transaction ID: 2-5 lowercase letters, dash, 12 alphanumeric characters
  static transactionID_format = /^[a-z]{2,5}-[A-Za-z0-9]{12}$/;
  static isValidTransactionID(transactionID) {
    return this.transactionID_format.test(transactionID);
  }
  // Validates email: requires text@domain.tld format with no spaces
  static email_format = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  static isValidEmail(email) {
    return this.email_format.test(email);
  }

  // Validates datetime format: YYYY-MM-DD hh:mm:ss
  static datetime_format = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  static isValidDatetime(datetime) {
    return this.datetime_format.test(datetime);
  }

  static isValidBoolean(value) {
    return typeof value === "boolean";
  }
}

export default FormatValidator;
