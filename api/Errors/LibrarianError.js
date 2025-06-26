class LibrarianError extends Error {
  constructor(message) {
    super(message);
    this.name = "LibrarianError";
  }
}

export default LibrarianError;
