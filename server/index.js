const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');
   const dotenv = require('dotenv');
   const fileRoutes = require('./routes/files');
   const linkRoutes = require('./routes/links');
   const path = require('path');

   dotenv.config();
   const app = express();

   app.use(cors());
   app.use(express.json());
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   app.use('/api/files', fileRoutes);
   app.use('/api/links', linkRoutes);

   mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   }).then(() => console.log('MongoDB connected'))
     .catch(err => console.error(err));

   app.listen(5000, () => console.log('Server running on port 5000'));