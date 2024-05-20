const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
userId:{type:String},
    profileImgURL: String,
    token:String,
    accessToken:    {type: String},
    contentType: {type: String},
    image: Buffer
});

const ImageModole = mongoose.model('Image', userSchema);

module.exports = ImageModole;
