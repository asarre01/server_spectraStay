const { deleteAllPlaceForOneSpectacle } = require("./placeControl");

// Définition de la fonction getAllSpectacle pour récupérer la liste des spectacles de la base de données
exports.getAllSpectacle = async (req, res) => {
    try {
        // Définir la requête SQL pour sélectionner tous les spectacles
        const query = "SELECT * FROM spectacles";

        // Exécuter la requête SQL
        connection.query(query, (err, results) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error(
                    "Erreur lors de la récupération des spectacles :",
                    err
                );
                return res.status(500).json({
                    error: "Erreur serveur lors de la récupération des spectacles.",
                });
            }

            // Si la récupération réussit, renvoyer une réponse avec un code 200 et la liste des spectacles
            res.status(200).json({ spectacles: results });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction addSpectacle pour ajouter un spectacle à la base de données
exports.addSpectacle = async (req, res) => {
    try {
        // Extraction des données de la requête (nom du spectacle, nom de la salle, date du spectacle, coordonnées x et y)
        const { nomSpectacle, nomSalle, dateSpectacle, x, y } = req.body;

        // Définition de la requête SQL pour insérer un nouveau spectacle dans la table "spectacles"
        const query =
            "INSERT INTO spectacles (nomSpectacle, nomSalle, dateSpectacle, x, y) VALUES (?, ?, ?, ?, ?)";

        // Exécution de la requête SQL avec les données fournies
        connection.query(
            query,
            [nomSpectacle, nomSalle, dateSpectacle, x, y],
            (err, result) => {
                // Vérification des erreurs lors de l'exécution de la requête SQL
                if (err) {
                    // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                    console.error(
                        "Erreur lors de l'enregistrement du spectacle :",
                        err
                    );
                    return res.status(500).json({
                        error: "Erreur serveur lors de l'enregistrement du spectacle.",
                    });
                }

                // Si la requête s'exécute avec succès, renvoyer une réponse avec un code 201 et un message de succès
                // Inclure également l'ID du spectacle nouvellement inséré dans la base de données
                res.status(201).json({
                    message: "Spectacle enregistré avec succès.",
                    spectacleId: result.insertId, // Utiliser result.insertId pour obtenir l'ID du nouveau spectacle
                });
            }
        );
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction deleteSpectacle pour supprimer un spectacle de la base de données
exports.deleteSpectacle = async (req, res) => {
    try {
        const spectacleId = req.params.id; // Récupérer l'ID du spectacle à supprimer à partir des paramètres de la requête

        // Supprimer toutes les places associées à ce spectacle
        deleteAllPlaceForOneSpectacle(req.params.spectacleId, (err) => {
            if (err) {
                // En cas d'erreur, répondre avec un code d'erreur 500
                return res.status(500).json({
                    error: "Erreur serveur lors de la suppression des places associées au spectacle.",
                });
            }

            // Définir la requête SQL pour supprimer le spectacle en fonction de son ID
            const query = "DELETE FROM spectacles WHERE idSpectacle = ?";

            // Exécuter la requête SQL pour supprimer le spectacle
            connection.query(query, [spectacleId], (err, result) => {
                if (err) {
                    // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                    console.error("Erreur lors de la suppression du spectacle :", err);
                    return res.status(500).json({
                        error: "Erreur serveur lors de la suppression du spectacle.",
                    });
                }

                // Vérifier si aucune ligne n'a été affectée par la suppression (aucun spectacle avec cet ID)
                if (result.affectedRows === 0 && result.warningCount === 0) {
                    return res.status(404).json({ error: "Spectacle non trouvé." });
                }

                // Si la suppression réussit, renvoyer une réponse avec un code 200 et un message de succès
                res.status(200).json({ message: "Spectacle supprimé avec succès." });
            });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};


// Définition de la fonction updateSpectacle pour modifier un spectacle dans la base de données
exports.updateSpectacle = async (req, res) => {
    try {
        const spectacleId = req.params.id; // Récupérer l'ID du spectacle à modifier à partir des paramètres de la requête
        const { nomSpectacle, nomSalle, dateSpectacle, x, y } = req.body;

        // Vérifier si au moins un des champs est fourni
        if (!nomSpectacle && !nomSalle && !dateSpectacle && x === undefined && y === undefined) {
            return res.status(400).json({ error: "Aucune donnée de spectacle fournie pour la mise à jour." });
        }

        // Définir la requête SQL pour modifier le spectacle en fonction de son ID
        let query = "UPDATE spectacles SET";
        const params = [];
        if (nomSpectacle) {
            query += " nomSpectacle = ?,";
            params.push(nomSpectacle);
        }
        if (nomSalle) {
            query += " nomSalle = ?,";
            params.push(nomSalle);
        }
        if (dateSpectacle) {
            query += " dateSpectacle = ?,";
            params.push(dateSpectacle);
        }
        if (x !== undefined) {
            query += " x = ?,";
            params.push(x);
        }
        if (y !== undefined) {
            query += " y = ?,";
            params.push(y);
        }
        // Supprimer la virgule finale
        query = query.slice(0, -1);
        query += " WHERE idSpectacle = ?";

        // Ajouter l'ID du spectacle à modifier aux paramètres
        params.push(spectacleId);

        // Exécuter la requête SQL avec les nouveaux paramètres
        connection.query(query, params, (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la modification du spectacle :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la modification du spectacle.",
                });
            }

            // Vérifier si aucune ligne n'a été affectée par la modification (aucun spectacle avec cet ID)
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Spectacle non trouvé." });
            }

            // Si la modification réussit, renvoyer une réponse avec un code 200 et un message de succès
            res.status(200).json({ message: "Spectacle modifié avec succès." });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};