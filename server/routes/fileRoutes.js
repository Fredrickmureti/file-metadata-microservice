const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose'); // Ensure mongoose is imported if not already
const File = require('../models/File'); // Adjust the path as necessary

const router = express.Router();

const uploadsPath = path.resolve(__dirname, '../uploads'); // resolve the uploads folder path
if (!fs.existsSync(uploadsPath)) { //check if the uploads folder exists
  fs.mkdirSync(uploadsPath, { recursive: true }); // if the uploads folder doesn't exist, create it
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileMetadata = {
    filename: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: req.file.path
  };

  try {
    const file = new File(fileMetadata);
    await file.save(); // Save to the database
    res.json(fileMetadata);
  } catch (err) {
    console.error('Error saving file metadata to database:', err); // Log the error details
    res.status(500).json({ error: 'Error saving file metadata to database', details: err.message });
  }
});

module.exports = router;
