import ClientRepository from "../../Repositories/ClientRepository.js";

const clientRepo = new ClientRepository();

export const clientController = {
  async getProfile(req, res) {
    try {
      const clientId = req.user.id; // From auth middleware
      const profile = await clientRepo.getClientById(clientId);

      res.status(200).json({ data: profile });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  },

  async updateProfile(req, res) {
    try {
      const clientId = req.user.id;
      const updateData = req.body;

      const result = await clientRepo.updateClient(clientId, updateData);
      res.status(200).json({
        message: "Profile updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  },

  async getBorrowedItems(req, res) {
    try {
      const clientId = req.user.id;
      const borrowedItems = await clientRepo.getBorrowedItems(clientId);

      res.status(200).json({ data: borrowedItems });
    } catch (error) {
      console.error("Get borrowed items error:", error);
      res.status(500).json({ error: "Failed to fetch borrowed items" });
    }
  },

  async checkoutItem(req, res) {
    try {
      const clientId = req.user.id;
      const { itemId } = req.params;

      const result = await clientRepo.checkoutItem(clientId, itemId);
      res.status(200).json({
        message: "Item checked out successfully",
        data: result,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Failed to checkout item" });
    }
  },

  async returnItem(req, res) {
    try {
      const clientId = req.user.id;
      const { itemId } = req.params;

      const result = await clientRepo.returnItem(clientId, itemId);
      res.status(200).json({
        message: "Item returned successfully",
        data: result,
      });
    } catch (error) {
      console.error("Return error:", error);
      res.status(500).json({ error: "Failed to return item" });
    }
  },
};
