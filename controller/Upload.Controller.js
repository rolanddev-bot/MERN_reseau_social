const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);

module.exports.uploaProfil = async (req, res) => {
    // if (file.detectedFileExtension != ".jpg") next(new Error("Invalid file type"));
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

    const fileName = req.body.name + '.jpg'
    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );

    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set: { picture: "./uploads/profil/" + fileName } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (err) return res.status(401).json(' erreur' + err);

                else return res.status(200).json(docs);

            }
        )
    } catch (err) {
        return res.status(400).send('il a y eu une erreur' + err);
    }
}