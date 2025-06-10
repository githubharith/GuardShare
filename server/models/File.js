const mongoose = require('mongoose');

   const fileSchema = new mongoose.Schema({
     filename: String,
     path: String,
     mimeType: String,
     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     permissions: [{ type: String }],
     createdAt: { type: Date, default: Date.now },
   });

   module.exports = mongoose.model('File', fileSchema);