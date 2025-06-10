const express = require('express');
   const { v4: uuidv4 } = require('uuid');
   const Link = require('../models/Link');
   const File = require('../models/File');
   const router = express.Router();

   router.post('/generate', async (req, res) => {
     try {
       const { fileId, expiresAt, verificationType, verificationData } = req.body;
       const link = new Link({
         file: fileId,
         linkId: uuidv4(),
         expiresAt: expiresAt ? new Date(expiresAt) : null,
         verificationType,
         verificationData,
       });
       await link.save();
       res.json({ link: `http://localhost:5173/link/${link.linkId}` });
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });

   router.get('/:linkId', async (req, res) => {
     try {
       const link = await Link.findOne({ linkId: req.params.linkId }).populate('file');
       if (!link) return res.status(404).json({ error: 'Link not found' });
       if (link.expiresAt && link.expiresAt < new Date()) {
         return res.status(403).json({ error: 'Link expired' });
       }
       res.json({ file: link.file, verificationType: link.verificationType, expiresAt: link.expiresAt });
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });

   router.post('/:linkId/verify', async (req, res) => {
     try {
       const { name } = req.body;
       const link = await Link.findOne({ linkId: req.params.linkId });
       if (!link) return res.status(404).json({ error: 'Link not found' });
       if (link.verificationType === 'none') return res.json({ verified: true });
       if (link.verificationType === 'full' && name === link.verificationData[0]) {
         return res.json({ verified: true });
       }
       if (link.verificationType === 'semi' && link.verificationData.includes(name)) {
         return res.json({ verified: true });
       }
       res.status(403).json({ error: 'Verification failed' });
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });

   module.exports = router;