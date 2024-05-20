
const express = require("express");
const app = express();

const User = require("../controllers/authController");
const FaceScanController = require('../controllers/faceScanController')
const loginModel = require('../controllers/loginController');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

app.use(express.json());

router.post('/face-scan', authenticateToken, FaceScanController.scanFace);
router.post("/register", User.register);
router.get('/users', authenticateToken, loginModel.getUser);
router.put('/users/:userId', authenticateToken, User.updateUser);
router.post("/login", loginModel.loginUser);
router.post("/logout",authenticateToken, loginModel.logoutUser);
router.post('/payment',authenticateToken, loginModel.makePayment);

module.exports = router;
