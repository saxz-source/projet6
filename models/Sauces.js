const mongoose = require("mongoose");

const saucesSchema = mongoose.Schema({
    userId : {type:String},
    name : {type:String},
    manufacturer : {type:String},
    description : {type:String},
    mainPepper : {type:String},
    imageUrl : {type:String},
    heat : {type:Number},
    likes : {type:Number},
    dislikes : {type:Number},
    usersLiked : [{body:String}],
    usersDisliked : [{body:String}],
});



module.exports = mongoose.model('Sauces', saucesSchema);
