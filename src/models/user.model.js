const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    lastname: { type: String , required: true},
    phone: { type: String },
    indentity:{type:String},
    profileImgURL: String,
    token:String,
    payments: [{
        amount: { type: Number, default: 0 },
        PaymentDate: { type: Date },
    }],
    accessToken:    {type: String},
    contentType: {type: String},
    image: Buffer
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
