import Repository from "./Repository.js";

class ItemRepository extends Repository {
  constructor() {
    super();
  }

  // User Catalog methods

  async findItemsByQuery(query) {}

  async findItemsByFilters(filters) {
    try {
      await this.db.initConnection();

      let query = `SELECT * FROM library_items WHERE 1=1`;

      let params = [];

      for (const [key, value] of Object.entries(filters)) {
        if (value && value.trim() !== "") {
          query += ` AND ${key} LIKE ?`;
          params.push(`%${value.trim()}%`);
        }
      }

      const results = await this.db.executeQuery(query, params);
      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }
}

export default ItemRepository;
