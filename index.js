const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Handlebars view engine
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'assets')));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/addProject', (req, res) => {
  res.render('addProject');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/project-detail', (req, res) => {
  res.render('project-detail');
});

app.get('/testimonials', (req, res) => {
  res.render('testimonials');
});

app.get('/update-my-project', (req, res) => {
  res.render('update-my-project');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
