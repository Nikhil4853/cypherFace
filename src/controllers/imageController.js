const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const imageModel = require('../models/image.model');



// Upload function for image
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const { userId } = req.params;
        if (!userId) {
            return res.status(400).send('User ID is required.');
        }
        const newImage = await imageModel.create({
            profileImgURL: req.file.originalname,
            contentType: req.file.mimetype,
            image: req.file.buffer,
            userId:userId
            
        });
        await   newImage.save()
        res.status(201).send('Image uploaded successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading image.');
    }
};

// Update function for image
const editImage = async (req, res) => {
    try {
        console.log(req.body)
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).send('User ID is required.');
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (req.file) {
            user.profileImgURL = req.file.filename;
            await user.save();
            res.status(200).send('Image updated successfully!');
        } else {
            return res.status(400).send('No file uploaded.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating image.');
    }
};

const getImage=async (req, res) => {
console.log(req.params.userId)
    imageModel.findById(req.params.userId)
        .then(image => {
            if (!image) {
                return res.status(404).json({ error: 'Image not found' });
            }
            res.set('Content-Type', image.contentType);
            res.send(image.image);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};
module.exports = {getImage, uploadImage, editImage, upload };