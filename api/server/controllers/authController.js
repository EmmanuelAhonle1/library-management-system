import ClientRepository from "../../Repositories/ClientRepository.js";
import LibrarianRepository from "../../Repositories/LibrarianRepository.js";
import { validateUser } from "../middleware/validation.js";
import {
  authenticateUser,
  hashPassword,
  generateToken,
  verifyToken,
} from "../middleware/auth.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";

/* Repository Instances */
const clientRepo = new ClientRepository();
const librarianRepo = new LibrarianRepository();

/* User Type Repository Map */
const userTypeRepo = new Map([
  ["client", clientRepo],
  ["librarian", librarianRepo],
]);

export const authController = {
  async signUp(req, res) {
    try {
      const { userType } = req.params;
      const userData = req.body;
      console.log(userData);
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
      if (userTypeRepo.has(userType)) {
        repository = userTypeRepo.get(userType);
      } else {
        return res
          .status(400)
          .json({ error: `User type '${userType}' is not allowed` });
      }

      const result = await repository.createUser(userData);

      if (result.error) {
        console.log(result.error);
        if (result.error.code === "ER_DUP_ENTRY") {
          res.status(409).json({ data: result });

          return;
        } else {
          res.status(400).json({ data: result });
          return;
        }
      }

      // Generate JWT token for the newly created user
      const token = generateToken(userData, userType);

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

      let result;

      if (req.headers.authorization) {
        // Authenticate user using middleware
        result = await verifyToken(req.headers.authorization);

        return res.status(200).json({
          message: "Login successful",
          data: result,
        });
      } else {
        const users = await clientRepo.findUserByEmail(
          req.body.email,
          userType
        );
        const foundUser = users?.[0] ?? null;

        if (!foundUser) {
          return res.status(404).json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(
          req.body.password,
          foundUser.password
        );

        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate token with the user data from database
        const token = generateToken(foundUser, userType);

        // Send successful response with token
        return res.status(200).json({
          message: "Login successful",
          data: {
            userId: foundUser[`${userType.toLowerCase()}_id`],
            email: foundUser.email,
            first_name: foundUser.first_name,
            last_name: foundUser.last_name,
          },
          token: token,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  },
};
