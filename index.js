const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const {createServer} = require('http');
const connectDB = require('./models/db');

const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/user'));
app.use('/', express.static(path.join(__dirname, 'static')));
const fs = require('fs');

const httpServer = createServer(app);
let port = process.env.PORT || 3000;

const io = socketIO(httpServer);

httpServer.listen(port);
console.log(`Server started on port ${port}`);

// Handling Error
process.on('unhandledRejection', err => {
  console.log(`An error occurred: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

// app.get('/profilePicture/:filename', (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, 'uploads', filename);

//   fs.access(filePath, fs.constants.F_OK, err => {
//     if (err) {
//       return res.status(404).send('File not found');
//     }
//     res.sendFile(filePath);
//   });
// });

// Endpoint to get profile pictures
app.get('/profilePicture/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.sendFile(filePath);
});

require('./Socket/socketEvent')(io);
require('./Socket/socketFunction').init(io);
connectDB();
