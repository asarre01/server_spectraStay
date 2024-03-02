// Définition de la fonction getAllHotel pour récupérer la liste des hôtels de la base de données
exports.getAllHotel = async (req, res) => {
    try {
        const query = "SELECT * FROM hotels";
        connection.query(query, (err, results) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la récupération des hôtels :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la récupération des hôtels.",
                });
            }

            // Si la récupération réussit, renvoyer une réponse avec un code 200 et la liste des hôtels
            res.status(200).json({ hotels: results });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction addHotel pour ajouter un hotel à la base de données
exports.addHotel = async (req, res) => {
    try {
        // Extraction des données de la requête (nom de l'hotel, coordonnées x et y)
        const { nom, x, y } = req.body;

        // Définition de la requête SQL pour insérer un nouveau hotel dans la table "hotels"
        const query = "INSERT INTO hotels (nom, x, y) VALUES (?, ?, ?)";

        // Exécution de la requête SQL avec les données fournies
        connection.query(query, [nom, x, y], (err, result) => {
            // Vérification des erreurs lors de l'exécution de la requête SQL
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de l'enregistrement de l'hotel :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de l'enregistrement de l'hotel.",
                });
            }

            // Si la requête s'exécute avec succès, renvoyer une réponse avec un code 201 et un message de succès
            // Inclure également l'ID de l'hotel nouvellement insérée dans la base de données
            res.status(201).json({
                message: "hotel enregistrée avec succès.",
                hotelId: result.id, // Utiliser result.id pour obtenir l'ID du nouveau hotel
            });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};


// Définition de la fonction deleteHotel pour supprimer un hotel de la base de données
exports.deleteHotel = async (req, res) => {
    try {
        const hotelId = req.params.id; // Récupérer l'ID de l'hotel à supprimer à partir des paramètres de la requête

        // Définir la requête SQL pour supprimer l'hotel en fonction de son ID
        const query = "DELETE FROM hotels WHERE id = ?";

        // Exécuter la requête SQL avec l'ID de l'hotel à supprimer
        connection.query(query, [hotelId], (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la suppression de l'hotel :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la suppression de l'hotel.",
                });
            }

            // Vérifier si aucune ligne n'a été affectée par la suppression (aucun hotel avec cet ID)
            if (result.affectedRows === 0 && result.warningCount === 0) {
                return res.status(404).json({ error: "hotel non trouvée." });
            }

            // Si la suppression réussit, renvoyer une réponse avec un code 200 et un message de succès
            res.status(200).json({ message: "hotel supprimée avec succès." });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};


// Définition de la fonction updateHotel pour modifier un hotel de la base de données
exports.updateHotel = async (req, res) => {
    try {
        const hotelId = req.params.id; // Récupérer l'ID de l'hotel à modifier à partir des paramètres de la requête
        const { nom, x, y } = req.body;

        // Vérifier si au moins un des champs est fourni
        if (!nom && x === undefined && y === undefined) {
            return res.status(400).json({ error: "Aucune donnée de hotel fournie pour la mise à jour." });
        }

        // Définir la requête SQL pour modifier l'hotel en fonction de son ID
        let query = "UPDATE hotels SET";
        const params = [];
        if (nom) {
            query += " nom = ?,";
            params.push(nom);
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
        query += " WHERE id = ?";

        // Ajouter l'ID de l'hotel à modifier aux paramètres
        params.push(hotelId);

        // Exécuter la requête SQL avec les nouveaux paramètres
        connection.query(query, params, (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la modification de l'hotel :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la modification de l'hotel.",
                });
            }

            // Vérifier si aucune ligne n'a été affectée par la modification (aucun hotel avec cet ID)
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "hotel non trouvée." });
            }

            // Si la modification réussit, renvoyer une réponse avec un code 200 et un message de succès
            res.status(200).json({ message: "hotel modifiée avec succès." });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};