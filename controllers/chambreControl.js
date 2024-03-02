// Définition de la fonction getAllChambre pour récupérer la liste des chambres de la base de données
exports.getAllChambre = async (req, res) => {
    try {
        // Définir la requête SQL pour récupérer toutes les chambres
        const query = "SELECT * FROM chambres";

        // Exécuter la requête SQL
        connection.query(query, (err, results) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console
                console.error(
                    "Erreur lors de la récupération des chambres :",
                    err
                );

                // Renvoyer une réponse avec un code d'erreur 500 (Erreur serveur) et un message d'erreur
                return res.status(500).json({
                    error: "Erreur serveur lors de la récupération des chambres.",
                });
            }

            // Si la récupération réussit, renvoyer une réponse avec un code 200 et la liste des chambres
            res.status(200).json({ chambres: results });
        });
    } catch (error) {
        // Renvoyer une réponse avec un code d'erreur 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({
            error: "Erreur serveur lors de la récupération des chambres.",
        });
    }
};

// Définition de la fonction addChambre pour ajouter une chambre à la base de données
exports.addChambre = async (req, res) => {
    try {
        // Extraction des données de la requête (numéro de chambre, catégorie de chambre, prix de loyer, etat)
        const { numéroChambre, categorieChambre, prixLoyer, etat } = req.body;

        // Définition de la requête SQL pour insérer une nouvelle chambre dans la table "chambres"
        const query = "INSERT INTO chambres (numéroChambre, categorieChambre, prixLoyer, etat) VALUES (?, ?, ?, ?)";

        // Exécution de la requête SQL avec les données fournies
        connection.query(query, [numéroChambre, categorieChambre, prixLoyer, etat], (err, result) => {
            // Vérification des erreurs lors de l'exécution de la requête SQL
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de l'enregistrement de la chambre :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de l'enregistrement de la chambre.",
                });
            }

            // Si la requête s'exécute avec succès, renvoyer une réponse avec un code 201 et un message de succès
            // Inclure également l'ID de la chambre nouvellement insérée dans la base de données
            res.status(201).json({
                message: "Chambre enregistrée avec succès.",
                chambreId: result.id,
            });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction deleteChambre pour supprimer une chambre de la base de données
exports.deleteChambre = async (req, res) => {
    try {
        const chambreId = req.params.id; // Récupérer l'ID de la chambre à supprimer à partir des paramètres de la requête

        // Définir la requête SQL pour supprimer la chambre en fonction de son ID
        const query = "DELETE FROM chambres WHERE id = ?";

        // Exécuter la requête SQL avec l'ID de la chambre à supprimer
        connection.query(query, [chambreId], (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la suppression de la chambre :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la suppression de la chambre.",
                });
            }

            // Vérifier si aucune ligne n'a été affectée par la suppression (aucune chambre avec cet ID)
            if (result.affectedRows === 0 && result.warningCount === 0) {
                return res.status(404).json({ error: "Chambre non trouvée." });
            }

            // Si la suppression réussit, renvoyer une réponse avec un code 200 et un message de succès
            res.status(200).json({ message: "Chambre supprimée avec succès." });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};

// Définition de la fonction updateChambre pour modifier une chambre de la base de données
exports.updateChambre = async (req, res) => {
    try {
        const chambreId = req.params.id; // Récupérer l'ID de la chambre à modifier à partir des paramètres de la requête
        const { numéroChambre, categorieChambre, prixLoyer, etat } = req.body;

        // Vérifier si au moins un des champs est fourni
        if (!numéroChambre && !categorieChambre && prixLoyer === undefined && !etat) {
            return res.status(400).json({ error: "Aucune donnée de chambre fournie pour la mise à jour." });
        }

        // Définir la requête SQL pour modifier la chambre en fonction de son ID
        let query = "UPDATE chambres SET";
        const params = [];
        if (numéroChambre) {
            query += " numéroChambre = ?,";
            params.push(numéroChambre);
        }
        if (categorieChambre) {
            query += " categorieChambre = ?,";
            params.push(categorieChambre);
        }
        if (prixLoyer !== undefined) {
            query += " prixLoyer = ?,";
            params.push(prixLoyer);
        }
        if (etat) {
            query += " etat = ?,";
            params.push(etat);
        }
        // Supprimer la virgule finale
        query = query.slice(0, -1);
        query += " WHERE id = ?";

        // Ajouter l'ID de la chambre à modifier aux paramètres
        params.push(chambreId);

        // Exécuter la requête SQL avec les nouveaux paramètres
        connection.query(query, params, (err, result) => {
            if (err) {
                // En cas d'erreur, afficher l'erreur dans la console et renvoyer une réponse avec un code d'erreur 500
                console.error("Erreur lors de la modification de la chambre :", err);
                return res.status(500).json({
                    error: "Erreur serveur lors de la modification de la chambre.",
                });
            }

            // Vérifier si aucune ligne n'a été affectée par la modification (aucune chambre avec cet ID)
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Chambre non trouvée." });
            }

            // Si la modification réussit, renvoyer une réponse avec un code 200 et un message de succès
            res.status(200).json({ message: "Chambre modifiée avec succès." });
        });
    } catch (error) {
        // En cas d'erreur, répondre avec un code 500 (Erreur serveur) et un message d'erreur
        res.status(500).json({ message: error.message });
    }
};
