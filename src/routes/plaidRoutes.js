const express = require('express');
const router = express.Router();
const plaidController = require('../controllers/plaidController');
const session = require('express-session');
const authenticateToken = require('../middleware/authMiddleware');

// Configure session middleware
router.use(session({
    secret: 'apple', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
router.get('/api/plaid/auth/', authenticateToken, plaidController.getAuthData);
router.post('/api/plaid/getAccessToken/', authenticateToken, plaidController.getAccessToken);
router.get('/api/plaid/getPublicToken/', authenticateToken, plaidController.generatePublicToken);

router.post('/api/plaid/link/token/create/', authenticateToken, plaidController.createLinkToken)
router.get('/api/plaid/link/token/get/', authenticateToken, plaidController.getLinkToken)

router.post('/api/plaid/processor/token/create/', authenticateToken, plaidController.createProcessorToken);
router.post('/api/plaid/accounts/balance/', authenticateToken, plaidController.getAccountBalances);

module.exports = router;
