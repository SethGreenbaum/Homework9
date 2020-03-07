const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

var notes = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
  console.log("homepage")
});
app.get("/notes",(req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
  console.log("notes")
});
app.get("/api/notes", (req, res) => {
  readFileAsync(path.resolve(__dirname, "./db/db.json"),"utf-8").then(function(data){
  res.json(JSON.parse(data));
});
});
app.get("/api/notes/:id", (req, res) => {
  var chosen = req.params.id;
  console.log(chosen+ ": was chosen");
  readFileAsync(path.resolve(__dirname, "./db/db.json"),"utf-8").then(function(data){
    var notes = JSON.parse(data); 
    for (var i = 0; i < notes.length; i++) {
      if (chosen === notes[i].id) {
        return res.json(notes[i]);
      }
    } return(res.json(`${chosen}: note not found`))
  });
});
app.post("/api/notes", function(req, res) {
    var newNote = req.body;
  
    console.log(newNote.title + "this was added from server side");

    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();

    readFileAsync(path.resolve(__dirname, "./db/db.json"),"utf-8").then(function(data){
      var notes = JSON.parse(data); 
      notes.push(newNote);
      var ret = JSON.stringify(notes)
      writeFileAsync(path.resolve(__dirname, "./db/db.json"),ret).then(function(){
        console.log("successfully logged")
      })
    });
    res.json(newNote);
});
app.delete("/api/notes/:id", function(req, res) {
    var chosen = req.params.id;
  
    readFileAsync(path.resolve(__dirname, "./db/db.json"),"utf-8").then(function(data){
      var notes = JSON.parse(data); 
      for (var i = 0; i < notes.length; i++) {
        if (chosen === notes[i].id) {
          notes.splice(i,1);
          console.log(chosen + ":  this was deleted from server side");
        }
      }
      var ret = JSON.stringify(notes)
      writeFileAsync(path.resolve(__dirname, "./db/db.json"),ret).then(function(){
        console.log("successfully logged")
        res.json(notes)
      })
    });
});
app.listen(PORT, () => {
    console.log("App listening on http://localhost:" + PORT);
});