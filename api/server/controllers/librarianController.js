import LibrarianRepository from "../../Repositories/LibrarianRepository.js";

const librarianRepo = new LibrarianRepository();

export const librarianController = {
  async getDashboard(req, res) {
    try {
      const librarianId = req.user.id;
      const dashboardData = await librarianRepo.getDashboard(librarianId);
      res.status(200).json({ data: dashboardData });
    } catch (error) {
      console.error("Get dashboard error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard" });
    }
  },

  async getAllClients(req, res) {
    try {
      const clients = await librarianRepo.getAllClients();
      res.status(200).json({ data: clients });
    } catch (error) {
      console.error("Get clients error:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  },

  async getOverdueItems(req, res) {
    try {
      const overdueItems = await librarianRepo.getOverdueItems();
      res.status(200).json({ data: overdueItems });
    } catch (error) {
      console.error("Get overdue items error:", error);
      res.status(500).json({ error: "Failed to fetch overdue items" });
    }
  },

  async addItem(req, res) {
    try {
      const itemData = req.body;
      const result = await librarianRepo.addItem(itemData);
      res.status(201).json({
        message: "Item added successfully",
        data: result,
      });
    } catch (error) {
      console.error("Add item error:", error);
      res.status(500).json({ error: "Failed to add item" });
    }
  },

  async updateItem(req, res) {
    try {
      const { itemId } = req.params;
      const updateData = req.body;
      const result = await librarianRepo.updateItem(itemId, updateData);
      res.status(200).json({
        message: "Item updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Update item error:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  },

  async deleteItem(req, res) {
    try {
      const { itemId } = req.params;
      await librarianRepo.deleteItem(itemId);
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Delete item error:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  },
};
