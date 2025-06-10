const mongoose = require('mongoose');

   const linkSchema = new mongoose.Schema({
     file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
     linkId: String,
     expiresAt: Date,
     verificationType: { type: String, enum: ['none', 'full', 'semi'] },
     verificationData: [String],
     createdAt: { type: Date, default: Date.now },
   });

   module.exports = mongoose.model('Link', linkSchema);