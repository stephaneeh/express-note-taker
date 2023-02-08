const notes = require('express').Router();
const uuid = require('./../helpers/uuid');
const fs = require('fs');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('./../helpers/fsUtils');


//GET route for retrieving all notes from db.json file
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note
notes.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
          ? res.json(result)
          : res.json('No note with that ID');
      });
  });
    
// DELETE Route for a specific note
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
      // create a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);
  
      // Save that array to the filesystem
      writeToFile('./db/db.json', result);
  
      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
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
      id: uuid(),
      };
  
        // Obtain existing notes
        readFromFile('./db/db.json', 'utf8', (err, data) => {
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
