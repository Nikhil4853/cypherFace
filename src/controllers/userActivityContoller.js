const UserActivity = require('../models/useractivity.model');
const logger = require('../models/logger');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const jwtSecret = uuidv4();

async function logUserActivity(userId, activityType,endpoint, errorCode) {
    try {
        await UserActivity.create({ userId, activityType ,endpoint, errorCode});
        logger.info(`User activity logged: userId=${userId}, activityType=${activityType}, endpoint=${endpoint}, errorCode=${errorCode}`);
    } catch (error) {
        console.error('Error logging user activity:', error);
        logger.error('Error logging user activity:', error);
        throw error;
    }
}

function generateToken(userId) {
    // Generate JWT token
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
    return token;
  }

module.exports = {logUserActivity, generateToken };
