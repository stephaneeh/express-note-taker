const path = require('path');
const notes = require('express').Router();

// GET Route for homepage
notes.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
notes.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

module.exports = notes;
