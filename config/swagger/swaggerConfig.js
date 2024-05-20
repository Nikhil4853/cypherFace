//swaggerConfig.js
module.exports = {
    info: {
        version: '1.0.0',
        title: 'Cypherface API Title',
        description: 'Cypherface API Description',
    },
    securityDefinitions: {
        JWTAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'JWT authorization token',
        },
    },
    security: [
        {
            JWTAuth: [],
        },
    ],
};
