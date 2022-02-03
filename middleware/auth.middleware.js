const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const config = process.env.TOKEN_SECRET;


module.exports.checkUser = (req, res, next) => {
    const token =
        req.cookies.jwt || req.query.token || req.headers["x-access-token"] || req.headers.authorization;
    if (!token) {
        return res.status(403).send("vous devez vous connecter pour acceder a ces informations");
    }
    try {
        jwt.verify(token, config, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie("jwt", "", { maxAge: 1 });
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }

    catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();

};


// le verify token et check user joue la même role cette fonction et l'autre joue le même role
module.exports.verifyToken = (req, res, next) => {
    const token =
        req.cookies.jwt || req.query.token || req.headers["x-access-token"] || req.headers.authorization;

    if (!token) {
        return res.status(403).send("token manquant ! vous devez vous connecter");
    }
    try {
        const decoded = jwt.verify(token, config);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports.requireAuth = (req, res, next) => {
    const token =
        req.cookies.jwt || req.query.token || req.headers["x-access-token"] || req.headers.authorization;
    if (token) {
        jwt.verify(token, config, async (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {

                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log('no token')
    }

};