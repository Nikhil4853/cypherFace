//swaggerGenerator.js
const swaggerAutogen = require('swagger-autogen')()
const swaggerConfig = require('./swaggerConfig');

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/authRoutes.js',
    './src/routes/imageRoutes.js',
    './src/routes/plaidRoutes.js']

swaggerAutogen(outputFile, endpointsFiles, swaggerConfig)