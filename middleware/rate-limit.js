const rateLimit = require("express-rate-limit");

const limitLogin = rateLimit({
    windowMs:60*1000,
    max:10,
    handler: (req, res) => {res.sendStatus(429)},

});

module.exports = limitLogin;