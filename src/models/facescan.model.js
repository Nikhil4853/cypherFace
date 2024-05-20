const mongoose = require('mongoose');

const faceScanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    imageData: { type: String, required: true },  //Need to further discuss on this
}, { timestamps: true });

const FaceScanModel = mongoose.model('FaceScan', faceScanSchema);

module.exports = FaceScanModel;
