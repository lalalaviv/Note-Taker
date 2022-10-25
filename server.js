// Importing required dependencies 
const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db.json")



// Initialise express app 
const app = express();
const PORT = process.env.PORT || 3001;



// Linking to assets 
app.use(express.static('public'));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Display index.html when all other routes are accessed
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Display notes.html when /notes is accessed
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
})




//NOTE CREATING SAVING AND DELETING 
// Gets the notes list  (updated for every new note and deleted note.)
app.get("/api/notes", function (req, res) {
    res.json(database);
})

// Adding new note to the json db file.
app.post("/api/notes", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    let newNote = req.body;

    // Test note will be the original note.
    let highestId = 99;
    // Loops through the array and finds the highest ID.
    for (let i = 0; i < database.length; i++) {
        let individualNote = database[i];

        if (individualNote.id > highestId) {
            // highestId will always be the highest numbered id in the notesArray.
            highestId = individualNote.id;
        }
    }
    // This assigns an id to the newNote. 
    newNote.id = highestId + 1;
    // and pushes it to db.json.
    database.push(newNote)

    // Writes to db.json file again.
    fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        }
        console.log("Your note was saved!");
    });
    // Responses with user's new note 
    res.json(newNote);
});

// Request to delete note by id
app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            // Splice takes i position, and deletes the 1 note
            database.splice(i, 1);
            break;
        }
    }
    // Writes to db.json file again.
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(database);
});




// Sets up listener and server
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
