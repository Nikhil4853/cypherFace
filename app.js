// src-backend/app.js
const express = require('express');
const userRouter = require('./src/routes/authRoutes');
const plaidRoutes = require('./src/routes/plaidRoutes');
const imgRoutes = require("./src/routes/imageRoutes");
const connectToMongoDB = require('./config/database'); // Import the database connection function
const PORT = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./config/swagger/swagger_output.json')

const app = express();

connectToMongoDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('❌ Error starting the application:❌', error);
        process.exit(1);
    });

    app.use(express.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    app.use(userRouter);
    app.use(imgRoutes);
    app.use(plaidRoutes);

module.exports = app;  
