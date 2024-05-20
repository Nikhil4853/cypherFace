const mongoose = require('mongoose');

function connectToMongoDB() {
    require('dotenv').config(); 

    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST;
    const database = process.env.DB_DATABASE;
    const encodedPassword = encodeURIComponent(password);
    const mongoDBURI = `mongodb://${username}:${encodedPassword}@${host}/${database}?directConnection=true&appName=mongosh+2.2.2`;

    return mongoose.connect(mongoDBURI, { useNewUrlParser: true })
        .then(() => {
            console.log('✅ MongoDB connected ✅');
        })
        .catch(error => {
            console.error('Error connecting to MongoDB:', error);
            throw error; 
        });
}

module.exports = connectToMongoDB;
