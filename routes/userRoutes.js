const express = require("express");
const router = express.Router();
const { registerClient, loginClient, logoutClient } = require("../controllers/userControl");
const { verifyToken } = require("../middleware/verifyToken");

// Routes pour l'enregistrement, la connexion et la déconnexion des utilisateurs
router.post("/register", registerClient);
router.post("/login", loginClient);
router.post("/logout", verifyToken, logoutClient);

module.exports = router;