
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const multer = require('multer');
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Setup Sequelize
const sequelize = new Sequelize('postgres://postgres:root@127.0.0.1:5432/postgres');

// Define Project model
const Project = sequelize.define('Project', {
  projectName: DataTypes.STRING,
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  description: DataTypes.TEXT,
  technologies: DataTypes.ARRAY(DataTypes.STRING),
  imageUrl: DataTypes.STRING
});

// Sync database
sequelize.sync()
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Database synchronization error:', err));

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Setup Handlebars view engine
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/addProject', (req, res) => {
  res.render('addProject');
});

app.post('/addProject', upload.single('uploadImage'), async (req, res) => {
  try {
    const { projectName, startDate, endDate, description, technologies } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Path to the uploaded file

    const techArray = Array.isArray(technologies) ? technologies : [technologies];

    await Project.create({
      projectName,
      startDate,
      endDate,
      description,
      technologies: techArray,
      imageUrl
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).send('An error occurred while saving the project.');
  }
});

// Route to get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).send('An error occurred while fetching projects.');
  }
});

// Route to delete a project
app.delete('/api/projects/:id', async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  try {
    // Hapus proyek dari database
    await Project.destroy({ where: { id: projectId } });
    res.status(200).send('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).send('An error occurred while deleting the project.');
  }
});


// Route untuk mendapatkan proyek berdasarkan ID
app.get('/api/projects/:id', async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).send('An error occurred while fetching the project.');
  }
});
// Route untuk mengupdate proyek
app.put('/api/projects/:id', upload.single('uploadImage'), async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  const { projectName, startDate, endDate, description, technologies } = req.body;

  try {
    // Temukan proyek berdasarkan ID
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Update proyek dengan data baru
    project.projectName = projectName;
    project.startDate = startDate;
    project.endDate = endDate;
    project.description = description;
    project.technologies = JSON.parse(technologies);

    // Jika ada gambar baru diupload, update image URL
    if (req.file) {
      project.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Simpan perubahan
    await project.save();

    res.status(200).send('Project updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('An error occurred while updating the project.');
  }
});

//-------------------------------

app.get('/contact', (req, res) => {
  res.render('contact');
});

// Route untuk mendapatkan detail project berdasarkan ID
app.get('/project-detail', async (req, res) => {
  const projectId = parseInt(req.query.id, 10);
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    const projectData = {
      projectTitle: project.projectName,
      projectImage: project.imageUrl,
      dateRange: `${new Date(project.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(project.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      timeDuration: calculateDuration(project.startDate, project.endDate),
      technologies: project.technologies,
      projectDescription: project.description
    };

    res.render('project-detail', projectData);
  } catch (err) {
    console.error('Error fetching project data:', err);
    res.status(500).send('Server error');
  }
});
//----------------------------------------------

// Fungsi untuk menghitung durasi proyek
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMs = end - start;
  const diffInMonths = diffInMs / (1000 * 60 * 60 * 24 * 30);
  return `${Math.round(diffInMonths)} months`;
}

app.get('/testimonials', (req, res) => {
  res.render('testimonials');
});

app.get('/update-my-project', (req, res) => {
  res.render('update-my-project');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
