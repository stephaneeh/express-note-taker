const notes = require('express').Router();
const fs = require('fs');
const uuid = require('../helpers/uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

//GET route for retrieving all notes from db.json file
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

//GET route for retrieving all notes from db.json file
notes.get('/:note_id', (req, res) => {
  const noteID = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteID);
      return result.length > 0
        ? res.json(result)
        : res.json('No tip with that ID');
    });
});


// POST Route for a new note
notes.post('/', (req, res) => {
  console.log(req.body);
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;
  if (req.body) {
      const newNote = {
        title,
        text,
        note_ID: uuid(),
      };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add new note
          parsedNotes.push(newNote);
  
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully saved note!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
  } else {
    res.status(500).json('Error in saving note');
  }
});




module.exports = notes;
