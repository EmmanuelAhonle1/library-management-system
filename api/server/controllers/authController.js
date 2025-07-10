import ClientRepository from "../../Repositories/ClientRepository.js";
import LibrarianRepository from "../../Repositories/LibrarianRepository.js";
import { validateUser } from "../middleware/validation.js";
import {
  authenticateUser,
  hashPassword,
  generateToken,
} from "../middleware/auth.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
const clientRepo = new ClientRepository();
const librarianRepo = new LibrarianRepository();

export const authController = {
  async signUp(req, res) {
    try {
      const { userType } = req.params;
      const userData = req.body;

      const { isValid, errors } = validateUser(userData);
      if (!isValid) {
        return res
          .status(400)
          .json({ error: "Invalid user data", details: errors });
      }

      if (userData.password) {
        userData.password = await hashPassword(userData.password);
      }

      let repository;
      switch (userType) {
        case "client":
          repository = clientRepo;
          break;
        case "librarian":
          repository = librarianRepo;
          break;
        default:
          return res
            .status(400)
            .json({ error: `User type '${userType}' is not allowed` });
      }

      const result = await repository.createUser(userData);

      if (result.error) {
        res.status(400).json({ message: result.error, data: result });
        return;
      }

      // Generate JWT token for the newly created user
      const token = generateToken(result, userType);

      res.status(201).json({
        message: `User of type ${userType} registered successfully!`,
        data: result,
        token: token,
      });
    } catch (error) {
      console.error("Sign-up error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  },

  async login(req, res) {
    try {
      const { userType } = req.params;
      const credentials = req.body;

      //authenticateUser(req, res, () => {});

      const result = await authenticateUser(req, res);

      if (result.success) {
        res.status(200).json({
          message: `User of type ${userType} logged in successfully!`,
          data: result,
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  },
};
