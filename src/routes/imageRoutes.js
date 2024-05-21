 
const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const {getImage, uploadImage, editImage,upload } = require('../controllers/imageController');

router.post('/api/upload',upload.single('file'), uploadImage);

router.put('/api/update/:userId',  upload.single('file'), editImage);

router.get('/api/get/image/:userId',getImage);
module.exports = router;

 