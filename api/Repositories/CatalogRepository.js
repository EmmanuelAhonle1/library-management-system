import Repository from "./Repository";

class CatalogRepository extends Repository {
  constructor() {
    super();
  }

  // User Catalog methods

  async findItemByFilters(filters) {
    try {
      await this.db.initConnection();

      let query = `SELECT * FROM items WHERE 1=1`;

      let params = [];

      if (filters.title && filters.title.trim() != "") {
        query += ` AND title LIKE ?`;
        params.push(`%${filters.title.trim()}%`);
      }

      if (filters.genre && filters.genre.trim() != "") {
        query += ` AND genre LIKE ?`;
        params.push(`%${filters.genre.trim()}%`);
      }

      if (filters.creator && filters.creator.trim() != "") {
        query += ` AND creator LIKE ?`;
        params.push(`%${filters.creator.trim()}%`);
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
