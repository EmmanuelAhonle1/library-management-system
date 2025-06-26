import { query } from "express";
import Transaction, {
  LibrarianTransactions,
} from "../Transactions/Transaction";

import UserRepository from "./UserRepository";
import LibrarianError from "../Errors/LibrarianError.js";
import User from "../Users/User.js";

class LibrarianRepository extends UserRepository {
  constructor() {
    super();
  }

  async validateLibrarian(librarianID) {
    const librarianResult = await this.findUser(librarianID);

    if (librarianResult.success === false) {
      return { success: false, error: "Librarian not found" };
    }

    if (!librarianResult.length || librarianResult[0].is_active !== true) {
      return { success: false, error: "Invalid or inactive librarian" };
    }

    // Return success if validation passes
    return { success: true, librarian: librarianResult[0] };
  }

  async addItem(librarianID, itemData) {
    try {
      const doesLibrarianExist = await this.validateLibrarian(librarianID);
      if (!doesLibrarianExist.success) {
        throw new LibrarianError(doesLibrarianExist.error);
      }

      // Validate required item data
      if (!itemData.item_id || !itemData.title) {
        throw new LibrarianError(
          "Missing required fields: item_id and title are required"
        );
      }

      await this.db.initConnection();

      // Set defaults for optional fields
      const itemDefaults = {
        status: "available",
        format: "book",
        max_checkout_days: 14,
        ...itemData,
        last_updated_by: librarianID,
      };

      const query = `
        INSERT INTO library_items (
          item_id, title, creator, isbn, genre, format, 
          max_checkout_days, status, image_url, last_updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        itemDefaults.item_id,
        itemDefaults.title,
        itemDefaults.creator || null,
        itemDefaults.isbn || null,
        itemDefaults.genre || null,
        itemDefaults.format,
        itemDefaults.max_checkout_days,
        itemDefaults.status,
        itemDefaults.image_url || null,
        itemDefaults.last_updated_by,
      ];

      const result = await this.db.executeQuery(query, params);

      if (result.affectedRows === 0) {
        throw new LibrarianError("Failed to add item");
      }

      return {
        success: true,
        message: "Item added successfully",
        itemID: itemDefaults.item_id,
        insertId: result.insertId,
      };
    } catch (error) {
      // Handle duplicate key errors specifically
      if (error.code === "ER_DUP_ENTRY") {
        return { success: false, error: "Item with this ID already exists" };
      }
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }

  async updateItem(librarianID, itemID, dataToUpdate) {
    try {
      if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
        throw new LibrarianError("No data provided to update");
      }

      const doesLibrarianExist = await this.validateLibrarian(librarianID);
      if (!doesLibrarianExist.success) {
        throw new LibrarianError(doesLibrarianExist.error);
      }

      await this.db.initConnection();

      // Build update query with validation
      const { query, params } = this.buildItemUpdateQuery(
        dataToUpdate,
        librarianID,
        itemID
      );

      const result = await this.db.executeQuery(query, params);

      if (result.affectedRows === 0) {
        throw new LibrarianError("Item not found or no changes made");
      }

      return {
        success: true,
        message: "Item updated successfully",
        affectedRows: result.affectedRows,
        itemID: itemID,
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }

  // Helper method to build dynamic UPDATE queries for items
  buildItemUpdateQuery(dataToUpdate, librarianID, itemID) {
    const allowedFields = [
      "title",
      "creator",
      "isbn",
      "genre",
      "format",
      "max_checkout_days",
      "status",
      "image_url",
    ];

    const fieldsToUpdate = [];
    const params = [];

    // Build SET clause dynamically - only include valid fields
    for (const [field, value] of Object.entries(dataToUpdate)) {
      if (
        allowedFields.includes(field) &&
        value !== undefined &&
        value !== null
      ) {
        fieldsToUpdate.push(`${field} = ?`);
        params.push(value);
      }
    }

    if (fieldsToUpdate.length === 0) {
      throw new LibrarianError("No valid fields provided for update");
    }

    // Always add last_updated_by for audit trigger
    fieldsToUpdate.push("last_updated_by = ?");
    params.push(librarianID);

    // Add itemID for WHERE clause
    params.push(itemID);

    const query = `
      UPDATE library_items 
      SET ${fieldsToUpdate.join(", ")} 
      WHERE item_id = ?
    `;

    return { query, params };
  }

  async deleteItem(librarianID, itemID) {
    try {
      const doesLibrarianExist = await this.validateLibrarian(librarianID);
      if (!doesLibrarianExist.success) {
        throw new LibrarianError(doesLibrarianExist.error);
      }

      await this.db.initConnection();

      // Begin transaction for atomic deletion
      await this.db.executeQuery("START TRANSACTION");

      try {
        // Step 1: Check if item exists
        const itemCheckQuery =
          "SELECT item_id, title FROM library_items WHERE item_id = ?";
        const itemResult = await this.db.executeQuery(itemCheckQuery, [itemID]);

        if (itemResult.length === 0) {
          throw new LibrarianError("Item not found");
        }

        const itemTitle = itemResult[0].title;

        // Step 2: Delete from item_transactions first (child table)
        const deleteTransactionsQuery =
          "DELETE FROM item_transactions WHERE item_id = ?";
        await this.db.executeQuery(deleteTransactionsQuery, [itemID]);

        // Step 3: Manual audit log insertion (since no DELETE trigger exists)
        const auditId = this.generateAuditId();
        const auditQuery = `
          INSERT INTO item_audit_logs (audit_id, item_id, librarian_id, transaction_type, description)
          VALUES (?, ?, ?, 'item_deleted', ?)
        `;
        const auditDescription = `Item '${itemTitle}' deleted by librarian ${librarianID}`;
        await this.db.executeQuery(auditQuery, [
          auditId,
          itemID,
          librarianID,
          auditDescription,
        ]);

        // Step 4: Delete from library_items (parent table)
        const deleteItemQuery = "DELETE FROM library_items WHERE item_id = ?";
        const deleteResult = await this.db.executeQuery(deleteItemQuery, [
          itemID,
        ]);

        if (deleteResult.affectedRows === 0) {
          throw new LibrarianError("Failed to delete item");
        }

        // Commit transaction
        await this.db.executeQuery("COMMIT");

        return {
          success: true,
          message: "Item deleted successfully",
          deletedItemID: itemID,
          itemTitle: itemTitle,
        };
      } catch (error) {
        // Rollback on error
        await this.db.executeQuery("ROLLBACK");
        throw error;
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await this.db.closeConnection();
    }
  }

  // Helper method to generate audit ID
  generateAuditId() {
    const prefix = "aud";
    const randomString = Math.random()
      .toString(36)
      .substring(2, 14)
      .padEnd(12, "0");
    return `${prefix}-${randomString}`;
  }
}

export default LibrarianRepository;
