class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class AbstractionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AbstractionError";
  }
}

export { ValidationError, AbstractionError };
