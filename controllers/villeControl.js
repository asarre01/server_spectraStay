// Définition de la fonction getAllVille pour récupérer la liste des villes de la base de données
exports.getAllVille = async (req, res) => {
    try {
        const query = "SELECT * FROM villes";
        connection.query(query, (err, results) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la récupération des villes :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la récupération des villes.",
                });
            }

            // Si la récupération réussit, renvoyer une réponse avec un code 200 et la liste des villes
            res.status(200).json({ villes: results });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction addVille pour ajouter une ville à la base de données
exports.addVille = async (req, res) => {
    try {
        // Extraction des données de la requête (nom de la ville, coordonnées x et y)
        const { nom, x, y } = req.body;

        // Définition de la requête SQL pour insérer une nouvelle ville dans la table "villes"
        const query = "INSERT INTO villes (nom, x, y) VALUES (?, ?, ?)";

        // Exécution de la requête SQL avec les données fournies
        connection.query(query, [nom, x, y], (err, result) => {
            // Vérification des erreurs lors de l'exécution de la requête SQL
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de l'enregistrement de la ville :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de l'enregistrement de la ville.",
                });
            }

            // Si la requête s'exécute avec succès, renvoyer une réponse avec un code 201 et un message de succès
            // Inclure également l'ID de la ville nouvellement insérée dans la base de données
            res.status(201).json({
                message: "Ville enregistrée avec succès.",
                villeId: result.id,
            });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction deleteVille pour supprimer une ville de la base de données
exports.deleteVille = async (req, res) => {
    try {
        const villeId = req.params.id; // Récupérer l'ID de la ville à supprimer à partir des paramètres de la requête

        // Définir la requête SQL pour supprimer la ville en fonction de son ID
        const query = "DELETE FROM villes WHERE id = ?";

        // Exécuter la requête SQL avec l'ID de la ville à supprimer
        connection.query(query, [villeId], (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la suppression de la ville :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la suppression de la ville.",
                });
            }

            // Vérifier si aucune ligne n'a été affectée par la suppression (aucune ville avec cet ID)
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Ville non trouvée." });
            }

            // Si la suppression réussit, renvoyer une réponse avec un code 200 et un message de succès
            res.status(200).json({ message: "Ville supprimée avec succès." });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction updateVille pour modifier une ville de la base de données
exports.updateVille = async (req, res) => {
    try {
        const villeId = req.params.id; // Récupérer l'ID de la ville à modifier à partir des paramètres de la requête
        const { nom, x, y } = req.body;

        // Définir la requête SQL pour modifier la ville en fonction de son ID
        let query = "UPDATE villes SET";
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

        // Ajouter l'ID de la ville à modifier aux paramètres
        params.push(villeId);

        // Exécuter la requête SQL avec les nouveaux paramètres
        connection.query(query, params, (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la modification de la ville :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la modification de la ville.",
                });
            }

            // Vérifier si aucune ligne n'a été affectée par la modification (aucune ville avec cet ID)
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Ville non trouvée." });
            }

            // Si la modification réussit, renvoyer une réponse avec un code 200 et un message de succès
            res.status(200).json({ message: "Ville modifiée avec succès." });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};