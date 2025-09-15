const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('view engine', 'ejs');

// ✅ Home route → show all notes
app.get('/', function (req, res) {
  fs.readdir('./files', function (err, files) {
    if (err) return res.send("Error reading files");

    // Convert filenames into objects {title: , _id: }
    let tasks = files.map(f => ({
      title: f.replace('.txt', ''), // filename without .txt
      _id: f                        // filename with .txt
    }));

    res.render('index', { title: "Home", files: tasks });
  });
});

// ✅ Create new note
app.post('/create', function (req, res) {
  const filename = req.body.title.split(' ').join('') + '.txt';
  fs.writeFile(`./files/${filename}`, req.body.details, function (err) {
    if (err) return res.send("Error creating file");
    res.redirect('/');
  });
});

// ✅ Read More (view full note)
app.get('/task/:id', function (req, res) {
  fs.readFile(`./files/${req.params.id}`, 'utf-8', function (err, filedata) {
    if (err) return res.send("File not found");
    res.render('task', { 
      title: req.params.id.replace('.txt', ''), 
      content: filedata 
    });
  });
});

// ✅ Edit page (load note into form)
app.get('/edit/:id', function (req, res) {
  fs.readFile(`./files/${req.params.id}`, 'utf-8', function (err, filedata) {
    if (err) return res.send("File not found");
    res.render('edit', { 
      filename: req.params.id, 
      title: req.params.id.replace('.txt', ''), 
      content: filedata 
    });
  });
});

// ✅ Update note
app.post('/update/:id', function (req, res) {
  fs.writeFile(`./files/${req.params.id}`, req.body.details, function (err) {
    if (err) return res.send("Error updating file");
    res.redirect('/');
  });
});

// ✅ Delete note
app.get('/delete/:id', function (req, res) {
  fs.unlink(`./files/${req.params.id}`, function (err) {
    if (err) return res.send("Error deleting file");
    res.redirect('/');
  });
});

// Start server
app.listen(3000, function () {
  console.log("✅ Server running at http://localhost:3000");
});
