const mongoose = require('mongoose');
mongoose.connect(
    "mongodb+srv://"+ process.env.DB_USER_PASS +"@cluster0.rjbri.mongodb.net/test",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    }
).then(() => { console.log('connexion reussi') })
    .catch((err) => { console.log('connexion échoué' + err) })