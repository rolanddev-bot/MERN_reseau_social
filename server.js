const express = require('express');
//const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');
const app = express();

//il me reste 20 minutes a faire dans le backend


/*app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));*/

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//verif les token
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});
//app.post('*', verifyToken);
//les Routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

app.listen(process.env.PORT, () => {
    console.log(`lancer sur le port ${process.env.PORT}`);
})