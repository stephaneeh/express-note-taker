const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

//GET route for retrieving all notes from db.json file
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

// POST Route for a new NOTES
notes.post('/', (req, res) => {
    console.log(req.body);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        noteID: uuidv4(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`New note added successfully 🚀`);
    } else {
      res.error('Error in adding new note');
    }
  });

module.exports = notes;
