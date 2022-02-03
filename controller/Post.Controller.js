const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

const fs = require('fs');
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);


module.exports.readPost = async (req, res) => {
    await PostModel.find((err, docs) => {
        if (err) console.log("il y a eu une erreur" + err)
        res.status(200).send(docs);
    }).sort({ createdAt: -1 });
}


module.exports.getPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('Id inconnu' + req.params.id);

    try {
        await PostModel.findById(req.params.id, (err, docs) => {
            if (!err) return res.status(201).json(docs);
            return res.status(401).json("un problème est survenu" + err);
        });

    } catch (err) {
        return res.status(401).json("une Erreur s'est survenue" + err)
    }
}



module.exports.createPost = async (req, res) => {

    let fileName;
    if (req.file !== null && req.file !== "") {
        try {
            if (req.file.detectedFileExtension !== ".jpg" && req.file.detectedFileExtension !== ".png"
                && req.file.detectedFileExtension !== ".jpeg") {
                throw Error('fichier invalide');
            }

            if (req.file.size > 500000) throw Error('la taille est trop grande');

        } catch (err) {
            const errors = uploadErrors(err);
            return res.status(400).json({ errors });
        }

        fileName = req.body.posterId + Date.now() + '.jpeg';

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        );

    }

    const DataPost = new PostModel({
        posterID: req.body.posterID,
        picture: req.file != null ? "./uploads/posts/" + fileName : "",
        message: req.body.message,
        video: req.body.video,
        lickers: [],
        comments: []
    });
    try {
        const post = await DataPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).json(err);
    }

}


module.exports.updatePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('Id inconnu !' + req.params.id);
    const DataToUpdate = {
        message: req.body.message
    }

    try {
        await PostModel.findByIdAndUpdate(req.params.id,
            { $set: DataToUpdate },
            { new: true },
            (err, docs) => {
                if (!err) return res.status(201).json(docs);
                else console.log("il y a eu un probleme!" + err);
            }
        )
    } catch (err) {
        return res.status(401).json('Un problème est survenu!' + err)
    }
}

// module.exports.deletePost = async (req, res) => {
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).json('Id inconnu !' + req.params.id);
//     try {
//         await PostModel.remove({ _id: req.params.id }).exec();
//         return res.status(200).json('supprimé avec succes!')
//     } catch (err) {
//         return res.status(400).json('Un problème est survenu!' + err)
//     }

// }

module.exports.deletePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('Id inconnu !' + req.params.id);
    try {
        await PostModel.findByIdAndDelete(req.params.id);
        return res.status(200).json('supprimé avec succes!')
    } catch (err) {
        return res.status(400).json('Un problème est survenu!' + err)
    }

}

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('Id inconnu !' + req.params.id);
    try {
        await PostModel.findByIdAndUpdate(req.params.id,
            { $addToSet: { lickers: req.body.id } },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).json(err)
            }
        );
        await UserModel.findByIdAndUpdate(req.body.id,
            { $addToSet: { likes: req.params.id } },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
                else return res.status(200).json(docs);
            }
        )
    } catch (err) {
        return res.status(400).json('Un problème est survenu!' + err)
    }

}

module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('Id inconnu !' + req.params.id);
    try {
        await PostModel.findByIdAndUpdate(req.params.id,
            { $pull: { lickers: req.body.id } },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).json(err)
            }
        );
        await UserModel.findByIdAndUpdate(req.body.id,
            { $pull: { likes: req.params.id } },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
                else return res.status(200).json(docs);
            }
        )
    } catch (err) {
        return res.status(400).json('Un problème est survenu!' + err)
    }

}


module.exports.CommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('Id inconnu !' + req.params.id);
    try {
        return PostModel.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    }
                }
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.status(200).json(docs)
                else return res.status(400).json(err)
            }
        );
    } catch (err) {
        return res.status(400).json('Un problème est survenu!' + err)
    }

}
module.exports.editCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('Id inconnu !' + req.params.id);
    try {
        return PostModel.findById(req.params.id,
            (err, docs) => {
                const TheComment = docs.comments.find((item) =>
                    item._id.equals(req.body.commentId)
                );
                if (!TheComment) return res.status(404).json('Commentaire not found');
                TheComment.text = req.body.text;
                return docs.save((err) => {
                    if (!err) return res.status(200).json(docs);
                    else return res.status(500).json("il y a eu une erreur" + err);
                });
            }
        )
    } catch (err) {
        return res.status(400).json('Un problème est survenu!' + err)
    }

}

module.exports.deleteCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('Id inconnu !' + req.params.id);
    try {
        return PostModel.findByIdAndUpdate(req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.status(200).json(docs);
                else return res.status(400).json(err);
            }
        )
    } catch (err) {
        return res.status(400).json('Un problème est survenu!' + err)
    }
}

