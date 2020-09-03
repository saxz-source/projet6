const express = require('express');
const helmet = require("helmet");

const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const path = require('path');


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.options('*', cors());

app.use(helmet.contentSecurityPolicy());
app.use(helmet.referrerPolicy());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.xssFilter());

app.disable("x-powered-by");


app.use(bodyParser.json());


mongoose.connect('',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


    app.use('/images', express.static(path.join(__dirname, 'images')));



// Implémentation des routes "users"
const userRoutes = require('./routes/users');

app.use('/api/auth', userRoutes);



// Implémenation des routes "sauces"
const saucesRoutes = require('./routes/sauces');

app.use('/api/sauces', saucesRoutes);




module.exports = app;
