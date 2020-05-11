// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname + '/notetakingapp/public')));


// Routes to first pages
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/notetakingapp/public/notes.html"));
});
app.get("/api/notes", function (req, res) {
    fs.readFile("./notetakingapp/db/db.json", "utf-8", (err, data) => {
        if (err) throw err
        const parsed = JSON.parse(data)
        res.json(parsed);
    })
});

let idNumber = 0;
const increaseID = function () {
    idNumber++
    return idNumber
};
app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    increaseID()
    newNote.id = idNumber;
    fs.readFile("./notetakingapp/db/db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        parsed.push(newNote);
        const stringified = JSON.stringify(parsed);
        fs.writeFile("./notetakingapp/db/db.json", stringified, "utf-8", err => {
            if (err) throw err;
        });
        res.json(parsed);
    });
});

app.delete("/api/notes/:id", function (req, res) {
    const idToDelete = parseInt(req.params.id);
    fs.readFile("./notetakingapp/db/db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        const filtered = parsed.filter(e => e.id !== idToDelete);
        const stringified = JSON.stringify(filtered);
        fs.writeFileSync("./notetakingapp/db/db.json", stringified, "utf-8", (err) => {
            if (err) throw err;
        })
        res.json(stringified)
    });
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});