// Définition de la fonction getAllPlace pour récupérer la liste des places de la base de données
exports.getAllPlace = async (req, res) => {
    try {
        const query = "SELECT * FROM places";
        connection.query(query, (err, results) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error(
                    "Erreur lors de la récupération des lieux :",
                    err
                );
                return res.status(500).json({
                    error: "Erreur serveur lors de la récupération des lieux.",
                });
            }

            // Si la récupération réussit, renvoyer une réponse avec un code 200 et la liste des lieux
            res.status(200).json({ places: results });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction getAllPlaceForOneSpectacle pour récupérer la liste des places d'un spectacle de la base de données
exports.getAllPlaceForOneSpectacle = async (req, res) => {
    try {
        const idSpectacle = req.params.id; // Récupérer l'ID du spectacle à partir des paramètres de la requête

        // Définir la requête SQL pour récupérer les places du spectacle spécifique avec les données du spectacle
        const query = `
            SELECT places.*, spectacles.*
            FROM places
            INNER JOIN spectacles ON places.idSpectacle = spectacles.id
            WHERE places.idSpectacle = ?
        `;

        // Exécuter la requête SQL avec l'ID du spectacle
        connection.query(query, [idSpectacle], (err, results) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error(
                    "Erreur lors de la récupération des lieux pour le spectacle :",
                    err
                );
                return res.status(500).json({
                    error: "Erreur serveur lors de la récupération des lieux pour le spectacle.",
                });
            }

            // Si la récupération réussit, renvoyer une réponse avec un code 200 et les données du spectacle avec les lieux associés
            res.status(200).json({ places: results });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction addPlace pour ajouter des places à la base de données
exports.addPlace = async (req, res) => {
    try {
        const { prixPlace, nbrPlaces, idSpectacle } = req.body; // Récupérer les données des places à partir du corps de la requête

        // Vérifier si les données requises sont fournies
        if (
            !prixPlace ||
            !nbrPlaces ||
            isNaN(prixPlace) ||
            isNaN(nbrPlaces) ||
            nbrPlaces <= 0
        ) {
            return res
                .status(400)
                .json({
                    error: "Données de place invalides fournies pour l'ajout.",
                });
        }

        // Définir la requête SQL pour insérer les places dans la table "places"
        const query =
            "INSERT INTO places (prixPlace, idSpectacle) VALUES (?, ?)";

        const values = [];
        for (let i = 0; i < nbrPlaces; i++) {
            values.push([prixPlace, idSpectacle]);
        }

        // Exécuter la requête SQL avec les valeurs préparées
        connection.query(query, [values], (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de l'ajout des places :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de l'ajout des places.",
                });
            }

            // Si l'ajout réussit, renvoyer une réponse avec un code 201 et un message de succès
            res.status(201).json({
                message: `${result.affectedRows} places ajoutées avec succès.`,
            });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction deleteOnePlace pour supprimer une place de la base de données
exports.deleteOnePlace = async (req, res) => {
    try {
        const placeId = req.params.id; // Récupérer l'ID de la place à supprimer à partir des paramètres de la requête

        // Définir la requête SQL pour supprimer la place en fonction de son ID
        const query = "DELETE FROM places WHERE idPlace = ?";

        // Exécuter la requête SQL avec l'ID de la place à supprimer
        connection.query(query, [placeId], (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error(
                    "Erreur lors de la suppression de la place :",
                    err
                );
                return res.status(500).json({
                    error: "Erreur serveur lors de la suppression de la place.",
                });
            }

            // Vérifier si aucune ligne n'a été affectée par la suppression (aucune place avec cet ID)
            if (result.affectedRows === 0 && result.warningCount === 0) {
                return res.status(404).json({ error: "Place non trouvée." });
            }

            // Si la suppression réussit, renvoyer une réponse avec un code 200 et un message de succès
            res.status(200).json({ message: "Place supprimée avec succès." });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction updatePriceForAllPlacesInSpectacle pour mettre à jour le prix de toutes les places d'un spectacle
exports.updatePriceForAllPlacesInSpectacle = async (req, res) => {
    try {
        const { idSpectacle, newPrice } = req.body; // Récupérer l'ID du spectacle et le nouveau prix à partir du corps de la requête

        // Vérifier si les données requises sont fournies
        if (!idSpectacle || !newPrice || isNaN(newPrice)) {
            return res.status(400).json({ error: "Données invalides fournies pour la mise à jour." });
        }

        // Définir la requête SQL pour mettre à jour le prix de toutes les places associées à ce spectacle
        const query = "UPDATE places SET prixPlace = ? WHERE idSpectacle = ?";

        // Exécuter la requête SQL avec le nouveau prix et l'ID du spectacle
        connection.query(query, [newPrice, idSpectacle], (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la mise à jour du prix des places :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la mise à jour du prix des places.",
                });
            }

            // Si la mise à jour réussit, renvoyer une réponse avec un code 200 et un message de succès
            res.status(200).json({
                message: `${result.affectedRows} places ont été mises à jour avec un nouveau prix de ${newPrice}.`,
            });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};