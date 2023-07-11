// import express server, paths
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

// initialize express and open a port
const app = express();
const PORT = 3000;

//middle ware
app.use(express.urlencoded({ extended: true })); // middleware for url data
app.use(express.json()); // middlware for json data
app.use(express.static('public')); // middleware for serving statis files from public folder

app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

// getting the notes from 'db.json' file and returning them json
app.get('/api/notes', (req, res) => {
  fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => {
    if (err) throw err; // sayng if there was an error opening file file then throw error
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body; // getting a new note
  newNote.id = uuid.v4(); // creating a unqiue ID for the note using uuid
  console.log(newNote);
  fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => {
    //fs.readFile('__dirname + /db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== noteId);
    if (err) throw err;
    fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json({ id: noteId });
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
