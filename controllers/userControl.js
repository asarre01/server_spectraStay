// Importer les bibliothèques
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// Fonction asynchrone pour enregistrer un client
exports.registerClient = async (req, res) => {
    try {
        // Récupérer les informations du client à partir du corps de la requête
        const { nom, prenom, email, password, isAdmin } = req.body;

        // Générer un sel pour le hachage du mot de passe
        const salt = await bcrypt.genSalt();

        // Hacher le mot de passe avec le sel généré
        const passwordHash = await bcrypt.hash(password, salt);

        // Insérer le client dans la base de données avec le mot de passe haché
        const query =
            "INSERT INTO clients (nom, prenom, email, password, isAdmin) VALUES (?, ?, ?, ?, ?)";
        connection.query(
            query,
            [nom, prenom, email, passwordHash, isAdmin],
            (result) => {
                // Répondre avec un code 201 (Créé) et un message de succès
                res.status(201).json({
                    message: "Client enregistré avec succès.",
                    clientId: result.id,
                });
            }
        );
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Exporter la fonction loginClient
exports.loginClient = async (req, res) => {
    try {
        // Récupérer l'email et le mot de passe de la requête
        const { email, password } = req.body;

        // Recherche de l'utilisateur dans la base de données par son email
        const query = "SELECT id, email, password FROM clients WHERE email = ?";
        connection.query(query, [email], async (err, results) => {
            // Vérifier s'il y a des erreurs lors de la recherche de l'utilisateur
            if (err) {
                return res.status(500).json({ error: "Erreur serveur lors de la recherche de l'utilisateur." });
            }

            // Vérifier si l'utilisateur existe
            if (results.length === 0) {
                return res.status(401).json({ error: "Adresse e-mail introuvable." });
            }
            
            // Récupérer les informations de l'utilisateur
            const user = results[0];

            // Vérifier si le mot de passe est correct en comparant avec celui stocké dans la base de données
            const isSame = await bcrypt.compare(password, user.password);

            if (!isSame) {
                return res.status(401).json({ error: "Mot de passe incorrect." });
            }

            // Générer un token JWT
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

            // Envoyer le token dans un cookie httpOnly
            res.cookie("token", token, { httpOnly: true });

            // Répondre avec un code 200 (OK) et un message de connexion réussie
            return res.status(200).json({ message: "Connexion réussie." });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour la déconnexion
exports.logoutClient = async (req, res) => {
    try {
        // Effacer le cookie du token en fixant son expiration à une date passée
        res.clearCookie('token');
        // Répondre avec un code 200 (OK) et un message de déconnexion réussie
        res.status(200).json({ message: 'Déconnexion réussie.' });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ error: error.message });
    }
};