
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';
const User = require('../models/user.model');

function generateJwtToken(user) {
    return jwt.sign(user, secretKey, { expiresIn: '2d' });
}

async function getPlaidAccessToken(authorizationHeader) {
    if (!authorizationHeader) {
        return null;
    }
    
    try {
        const decodedToken = jwt.decode(authorizationHeader);
        if (!decodedToken || !decodedToken.userId) {
            return null;
        }

        const userId = decodedToken.userId;
        const user = await User.findById(userId);

        if (!user) {
            return null; // User not found
        }

        return user.accessToken;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}


module.exports = { generateJwtToken, getPlaidAccessToken };
