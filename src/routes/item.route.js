const express = require('express');
const multer = require('multer');
const path = require('path');
const itemController = require('../controller/item.ctrl');

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post('/', upload.single('photo'), itemController.createItem);
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);

module.exports = router;
