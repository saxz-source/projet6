
const Sauces = require('../models/Sauces');
const fs = require('fs');
const {validationResult} = require("express-validator");


// LECTURE DE TOUTES LES SAUCES, route GET
exports.saucesAll = (req, res, next) => {

    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};



// LECTURE D UNE SAUCE, route GET
exports.saucesOne = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};



// CREATION DE SAUCE, route POST
exports.saucesCreate = (req, res, next) => {
 // récupération des erreurs liées aux middlewares de validation
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
 }




    delete req.body._id;

    // récupération des éléments de la requête
    const sauceObject =
    {
        ...JSON.parse(req.body.sauce),

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    }

    // fonction de validation de présence et des caractères des inputs.
    verifRegex = (sauceToVerif) => {
        var regexSecure = /[<>=#{}\[\]_+&|§]+/;
      
        if (sauceToVerif.userId &&
            !regexSecure.test(sauceToVerif.userId) &&
            sauceToVerif.name &&
            !regexSecure.test(sauceToVerif.name) &&
            sauceToVerif.manufacturer &&
            !regexSecure.test(sauceToVerif.manufacturer) &&
            sauceToVerif.description &&
            !regexSecure.test(sauceToVerif.description) &&
            sauceToVerif.mainPepper &&
            !regexSecure.test(sauceToVerif.mainPepper) &&
            sauceToVerif.imageUrl &&
            sauceToVerif.heat 
         
        ) {
            return true;

        } else {
            console.log(sauceObject.name);
            res.status(400).json({ message : "erreur" });
            return false;
        };
    };

    // création de la nouvelle sauce pour la base de données
    const sauce = new Sauces({ ...sauceObject });
    console.log(sauceObject)

    // test des items de la sauce, et sauvegarde
    if (verifRegex(sauceObject) === true) {
        sauce.save()
            .then(() => res.status(201).json({ message: 'sauce créée' }))
            .catch(error => res.status(400).json({ error }));
    };

};



// MODIFICATION DE SAUCE, route PUT
exports.saucesModify = (req, res, next) => {
    console.log(req.body);

    // récupération des éléments de la requête et reconstitution de l'objet sauce.
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),

            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

    // fonction de validation des entrées.
    verifRegex = (sauceToVerif) => {
        var regexSecure = /[<>=#{}\[\]_+&|§]+/;
     
        if (sauceToVerif.userId  &&
            !regexSecure.test(sauceToVerif.userId) &&
            sauceToVerif.name &&
            !regexSecure.test(sauceToVerif.name) &&
            sauceToVerif.manufacturer &&
            !regexSecure.test(sauceToVerif.manufacturer) &&
            sauceToVerif.description &&
            !regexSecure.test(sauceToVerif.description) &&
            sauceToVerif.mainPepper &&
            !regexSecure.test(sauceToVerif.mainPepper) &&
            sauceToVerif.heat &&
            sauceToVerif.imageUrl
        ) {
            return true;
        } else {
           
            res.status(400).json({ message: "erreur" });
            return false;
        };
    };

    // test de validation et mise à jour de la base de données
    if (verifRegex(sauceObject) == true) {
        Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "sauce modifiée" }))
            .catch(error => res.status(500).json({ error }));

    };

};


// SUPPRESSION DE SAUCE, route DELETE
exports.saucesDelete = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`./images/${filename}`, () => {
                Sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};




// GESTION DES LIKES, route POST
exports.saucesLike = (req, res, next) => {
    // récupération des erreurs liées aux middlewares de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // récupération du paramère "like"
    console.log(req.body);
    let udLikes = req.body.like;

    // récupération des données de la sauce concernée par la modification
        //>stockage des arrays des ID des utilisateurs ayant aimé ou non.
        //>vérification de la présence des ID dans ces arrays.
    Sauces.findOne({ _id: req.params.id }).then(sauce => {
        const arrayLikes = sauce.usersLiked;
        const arrayDislikes = sauce.usersDisliked;
        console.log(arrayDislikes + "  1");
        const idCheckDislikes = arrayDislikes.some(arrayDislikes => arrayDislikes._id == req.body.userId); //true si id présent
        const idCheckLikes = arrayLikes.some(arrayLikes => arrayLikes._id == req.body.userId); // true si id présent
        console.log(idCheckDislikes + "   2");


        // fonction de mise à jour de la sauce.
        updateTheSauce = () => {
            Sauces.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id, likes: sauce.likes, usersLiked: arrayLikes, dislikes: sauce.dislikes, usersDisliked: arrayDislikes })
                .then(() => res.status(200).json({ message: 'Likes actualisés' }))
                .catch(error => res.status(400).json({ error }));
        };


        // logique de modification de la sauce.
            //> A partir de la présence ou non d'un ID dans un des array, ajustement du nombre de likes,
            // et entrée ou sortie de l'ID pour l'array concerné.
        switch (udLikes) {

            case 1:
                if (!idCheckLikes && !idCheckDislikes) {
                    sauce.likes++;
                    arrayLikes.push(req.body.userId);
                    updateTheSauce();
                } else if (idCheckLikes) {
                    sauce.likes--;
                    arrayLikes.pop(req.body.userId);
                    updateTheSauce();
                } else if (idCheckDislikes) {
                    sauce.likes++;
                    sauce.dislikes--;
                    arrayDislikes.pop(req.body.userId);
                    arrayLikes.push(req.body.userId);
                    updateTheSauce();
                };

                break;

            case -1:
                if (!idCheckDislikes && !idCheckLikes) {
                    sauce.dislikes++;
                    arrayDislikes.push(req.body.userId);
                    updateTheSauce();
                } else if (idCheckDislikes) {
                    sauce.dislikes--;
                    arrayDislikes.pop(req.body.userId);
                    updateTheSauce();
                } else if (idCheckLikes) {
                    sauce.dislikes++;
                    sauce.likes--;
                    arrayLikes.pop(req.body.userId);
                    arrayDislikes.push(req.body.userId);
                    updateTheSauce();

                };

                break;

            case 0:
                if (idCheckLikes && !idCheckDislikes) {
                    sauce.likes--;
                    arrayLikes.pop(req.body.userId);
                    updateTheSauce();

                } else if (idCheckDislikes && !idCheckLikes) {
                    sauce.dislikes--;
                    arrayDislikes.pop(req.body.userId);
                    updateTheSauce();
                }else if (!idCheckLikes && !idCheckDislikes){
                    res.status(200).json({message :"l'utilisateur n'est plus dans un tableau"});
                };
                break;

            default:
                res.status(400).json({message: error});
        };


    })
        .catch(error => res.status(500).json({ error }));

};

