var express = require("express");
var path = require("path");
var app = express();
var PORT = process.env.PORT || 3000;
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
  return res.json(notes);
});
app.get("/api/notes/:id", (req, res) => {
  var chosen = req.params.id;
  console.log(chosen);
  for (var i = 0; i < notes.length; i++) {
    if (chosen === notes[i].id) {
      return res.json(notes[i]);
    }
  }
  return res.json(`${chosen} : note not found`);
});
app.post("/api/notes", function(req, res) {
    var newNote = req.body;
  
    console.log(newNote.title + "this was added from server side");
    
    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();
    notes.push(newNote);
  
    res.json(newNote);
});
app.delete("/api/notes/:id", function(req, res) {
    var chosen = req.params.id;
  
    
    for (var i = 0; i < notes.length; i++) {
        if (chosen === notes[i].id) {
          notes.splice(i,1);
          console.log(chosen + ":  this was deleted from server side");
        }
      }
    
});
  
app.listen(PORT, () => {
    console.log("App listening on http://localhost:" + PORT);
});