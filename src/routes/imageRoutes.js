 
const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const {getImage, uploadImage, editImage,upload } = require('../controllers/imageController');

router.post('/api/upload/:userId',upload.single('file'), uploadImage);
router.put('/api/update/:userId', authenticateToken, upload.single('image'), editImage);
router.get('/api/image/:userId',getImage);
module.exports = router;

 