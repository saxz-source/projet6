const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');
const { body } = require('express-validator');
const  limitLogin = require('../middleware/rate-limit');


router.post('/signup', [body("email").exists(), body("password").exists(), body("email").isEmail()], usersCtrl.signup);
router.post('/login', limitLogin, [body("email").exists().bail(), body("password").exists(), body("email").isEmail()], usersCtrl.login);

module.exports = router;