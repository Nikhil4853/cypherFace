const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    activityType: String,
    endpoint: String,
    errorCode: Number,
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;