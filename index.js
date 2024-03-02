// Chargement des variables d'environnement depuis le fichier .env
require("dotenv").config();

// Importation des modules
const express = require("express"); // Framework Express pour construire l'application web
const mysql = require("mysql"); // Module MySQL pour interagir avec la base de données
const cors = require("cors");
const helmet = require("helmet");
// Création de l'instance Express
const app = express();

// Définition du port sur lequel le serveur écoutera
const port = process.env.PORT || 3000;

// Middleware pour parser les objets JSON des requêtes entrantes
app.use(express.json());

// Middleware pour autoriser les requêtes cross-origin (CORS)
app.use(cors());

// Middleware Helmet pour sécuriser les applications Express
app.use(helmet());

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
    host: process.env.HOST, // Hôte de la base de données
    user: process.env.USER_DB, // Nom d'utilisateur de la base de données
    password: process.env.PASSWORD_DB, // Mot de passe de la base de données
    database: process.env.DATABASE_NAME, // Nom de la base de données
});

// Établissement de la connexion à la base de données
connection.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err);
        return;
    }
    console.log("Connecté à la base de données MySQL");
});

// Démarrage du serveur Express
app.listen(port, () => {
    console.log(`Serveur Express écoutant sur le port ${port}`);
});

// Export de l'application Express pour une utilisation dans d'autres fichiers
module.exports = app;
