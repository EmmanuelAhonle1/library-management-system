import { LibrarianTransactions } from "../Transactions/Transaction";

class LibrarianRepository extends UserRepository {
  constructor() {
    super();
  }

  async addItem(itemData, librarianID) {
    const librarianResult = await this.findUser(librarianID);

    if (librarianResult.success === false) {
      return { success: false, error: "Librarian not found" };
    }

    if (!librarianResult.length || librarianResult[0].is_active !== true) {
      return { success: false, error: "Invalid or inactive librarian" };
    }

    const transaction = new LibrarianTransactions.AddItemTransaction(
      librarianID,
      itemData.item_id
    );

    //TODO: add return
  }
}

export default LibrarianRepository;
