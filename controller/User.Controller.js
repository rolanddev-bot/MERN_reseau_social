const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

/** la fonction "await" doit etre declarer apres la fonction async elle permet
 davoir une reponse de la requete lancé ou du code qui est en train detre
executer avant de passer a la ligne suivante **** */

//Le mot-clé await fait attendre JavaScript jusqu'à ce que cette promesse se stabilise et renvoie 
//son résultat.

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.getUserinfo = async (req, res) => {
    console.log(req.params)
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu: ' + req.params.id);
        await UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('il y a eu une erreur:' + err)
    }).select('-password');
}

// le upsert:true permet d'ajouter ou modifier un enregistrement en verifiant l'id de l'exterieure
//le $set permet a la modification 
module.exports.udapeUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu:" + req.params.id)
    try {
        await UserModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (!err) res.status(200).send(docs)
                else res.status(500).send({ message: err });
            })
    }
    catch (err) {
        return res.status(500).json({ message: err })
    }

}


module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu :' + req.params.id)

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: 'supprimé avec success!' });
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idTofollow))
        return res.status(400).send('ID inconnu :' + req.params.id)

    try {
        //add to follower liste
        await UserModel.findByIdAndUpdate(req.params.id,
            { $addToSet: { following: req.body.idTofollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else res.status(400).json(err);
            });
        //add to following list
        //le **$addToSet** permet d'ajouter un element si ce element n'existe pas déjà s'il existe il ne fais rien
        await UserModel.findByIdAndUpdate(req.body.idTofollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            })
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
}


module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idTounfollow))
        return res.status(400).send('ID inconnu :' + req.params.id)

    try {
        //add to follower liste
        //****le $pull ici sert a retirer un element specifié dans dans un objet, un tableau  ou  un state****//
        await UserModel.findByIdAndUpdate(req.params.id,
            { $pull: { following: req.body.idTounfollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else res.status(400).json(err);
            });
        //add to following list
        await UserModel.findByIdAndUpdate(req.body.idTounfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            })
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
}


