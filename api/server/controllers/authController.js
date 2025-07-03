import ClientRepository from "../../Repositories/ClientRepository.js";
import LibrarianRepository from "../../Repositories/LibrarianRepository.js";

const clientRepo = new ClientRepository();
const librarianRepo = new LibrarianRepository();

export const authController = {
  async signUp(req, res) {
    try {
      const { userType } = req.params;
      const userData = req.body;

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
      res.status(201).json({
        message: `User of type ${userType} registered successfully!`,
        data: result,
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

      const repository = userType === "client" ? clientRepo : librarianRepo;
      const result = await repository.authenticateUser(credentials);

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
