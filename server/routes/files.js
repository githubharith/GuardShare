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
         mimeType: req.file.mimetype,
         owner: null,
         permissions: ['read'],
       });
       await file.save();
       res.json({ fileId: file._id, fileUrl: `http://localhost:5000/${req.file.path}` });
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });

   router.get('/:fileId', async (req, res) => {
     try {
       const file = await File.findById(req.params.fileId);
       if (!file) return res.status(404).json({ error: 'File not found' });
       res.json({ fileUrl: `http://localhost:5000/${file.path}`, mimeType: file.mimeType });
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });

   router.get('/', async (req, res) => {
     try {
       const files = await File.find({}).select('filename path mimeType _id');
       const filesWithUrls = files.map(file => ({
         ...file._doc,
         fileUrl: `http://localhost:5000/${file.path}`,
       }));
       res.json(filesWithUrls);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });

   module.exports = router;