import ItemRepository from "../../Repositories/ItemRepository.js";

const itemRepo = new ItemRepository();

export const itemController = {
  async searchItems(req, res) {
    try {
      // Extract search parameters from query string
      const filters = req.query;

      // Search items using repository
      const result = await itemRepo.findItemsByFilters(filters);
      console.log(result);
      if (!result.success) {
        return res.status(500).json({
          error: "Failed to search items",
          details: result.error,
        });
      }

      // Return search results
      return res.status(200).json({
        message: "Items found successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({
        error: "An error occurred while searching items",
        details: error.message,
      });
    }
  },
};
