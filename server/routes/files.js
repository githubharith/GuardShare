const express = require('express');
     const multer = require('multer');
     const File = require('../models/File');
     const router = express.Router();

     const storage = multer.diskStorage({
       destination: (req, file, cb) => cb(null, 'uploads/'),
       filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
     });
     const upload = multer({ storage });

     router.post('/upload', upload.single('file'), async (req, res) => {
       try {
         const file = new File({
           filename: req.file.filename,
           path: req.file.path,
           owner: null, // Update with user ID if authentication is added
           permissions: ['read'],
         });
         await file.save();
         res.json({ fileId: file._id });
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });

     module.exports = router;