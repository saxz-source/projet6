const express = require('express');

const router = express.Router();
const {body} = require("express-validator");





const saucesCtrl = require('../controllers/sauces');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('', auth, multer, [body("sauce").exists().isString()], saucesCtrl.saucesCreate);

router.get('', auth, saucesCtrl.saucesAll);
router.get('/:id', auth, saucesCtrl.saucesOne);
router.put('/:id', auth, multer, saucesCtrl.saucesModify);
router.delete('/:id', auth, saucesCtrl.saucesDelete);
router.post('/:id/like', auth, [body("userId").exists().isString(), body("like").exists().isInt({min: -1, max: 1})], saucesCtrl.saucesLike);

 

module.exports = router;