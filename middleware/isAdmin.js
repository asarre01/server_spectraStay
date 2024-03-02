const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
    // Récupérer le token à partir du cookie
    const token = req.cookies.token;

    // Vérifier si le token existe
    if (!token) {
        return res.status(401).json({ error: "Token de connexion manquant." });
    }

    try {
        // Vérifier et décoder le token JWT
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Récupérer l'ID de l'utilisateur à partir du token décodé
        const userId = decodedToken.id;

        // Ajouter l'ID de l'utilisateur à l'objet req.user pour une utilisation ultérieure dans les routes
        req.user = { id: userId };

        // Vérifier si l'utilisateur est un administrateur
        const query = "SELECT isAdmin FROM users WHERE id = ?";
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error(
                    "Erreur lors de la récupération des informations de l'utilisateur :",
                    err
                );
                return res
                    .status(500)
                    .json({
                        error: "Erreur serveur lors de la récupération des informations de l'utilisateur.",
                    });
            }

            if (results.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Utilisateur non trouvé." });
            }

            const isAdmin = results[0].isAdmin;
            if (!isAdmin) {
                // Retourner une réponse avec un code d'erreur 403 si l'accès est interdit
                return res.status(403).json({
                    message:
                        "Accès interdit. Seuls les administrateurs peuvent effectuer cette opération.",
                });
            }

            // Passer au middleware suivant
            next();
        });
    } catch (error) {
        // Si le token est invalide, répondre avec un code 401 (Non autorisé) et un message d'erreur
        res.status(401).json({ error: "Token de connexion invalide." });
    }
};

module.exports = { isAdmin };
