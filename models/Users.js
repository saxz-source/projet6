const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const mongooseHidden = require("mongoose-hidden")();


const usersSchema = mongoose.Schema({
    email : {type:String, required: true, unique: true, hide: true},
    password : {type:String, required: true, hide: true},

});


usersSchema.plugin(uniqueValidator);
usersSchema.plugin(mongooseHidden);


module.exports = mongoose.model('Users', usersSchema);

