// Middleware pour vérifier l'existence du token de connexion
const verifyToken = (req, res, next) => {
    // Récupérer le token à partir du cookie
    const token = req.cookies.token;

    // Vérifier si le token existe
    if (!token) {
        // Si le token n'existe pas, répondre avec un code 401 (Non autorisé) et un message d'erreur
        return res.status(401).json({ error: 'Token de connexion manquant.' });
    }

    // Si le token existe, passer au middleware suivant
    next();
};

module.exports = { verifyToken };