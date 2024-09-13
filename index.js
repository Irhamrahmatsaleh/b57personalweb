
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const multer = require('multer');;
const { Sequelize, DataTypes } = require('sequelize');
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require('./uploads/cloudinaryUpload');
const bcrypt = require('bcrypt');
const session = require('express-session');
const sessionStore = require('connect-session-sequelize')(session.Store);
const cloudinary = require('cloudinary').v2;
const { Pool } = require('pg');
const fs = require('fs');

// Config Cloudinary
cloudinary.config({
  cloud_name: 'dtrvk6quc',
  api_key: '821251785956655',
  api_secret: 'r8lCkMbSWNdi-c-hYpGaRMKW6Og'
});

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Sequelize
const sequelize = new Sequelize('postgres://postgres:root@127.0.0.1:5432/postgres');

// Define User and Project models
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  imageUrl: DataTypes.STRING
});

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

// Setup session
const sessionStoreInstance = new sessionStore({
  db: sequelize,
});
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  store: sessionStoreInstance,
}));

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
// app.get('/', (req, res) => {
//   res.render('index');
// });
// Route untuk halaman home
app.get('/', async (req, res) => {
  const projects = await Project.findAll();
  res.render('index', {
    projects,
    userName: req.session.userName
  });
});
//---------LOGIN AND REGISTER---------//
// Route untuk halaman register
app.get('/register', (req, res) => {
  res.render('register');
});
// Route untuk menangani register
app.post('/register', upload.single('imageUrl'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const imageUrl = req.file ? (await cloudinary.uploader.upload_stream(req.file.buffer)).secure_url : null;

    await User.create({
      name,
      email,
      password: hashedPassword,
      imageUrl
    });

    res.redirect('/login');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('An error occurred while registering the user.');
  }
});

// Route untuk halaman login
app.get('/login', (req, res) => {
  res.render('login');
});
// Route untuk menangani login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    req.session.userId = user.id;
    req.session.userName = user.name;
    res.redirect('/');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('An error occurred while logging in.');
  }
});
// Route untuk logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('An error occurred while logging out.');
    }
    res.redirect('/');
  });
});
// Middleware untuk cek user login
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};
//---------LOGIN AND REGISTER---------//
app.get('/addProject', (req, res) => {
  res.render('addProject', {
    userName: req.session.userName,
    isAddProjectOrDetailOrUpdate: true
  });
});
//--------------FILE YANG DI UPLOAD KE CLOUD--------------//
app.post('/addProject', isAuthenticated, upload.single('uploadImage'), async (req, res) => {
  try {
    const { projectName, startDate, endDate, description, technologies } = req.body;
    let imageUrl = null;

    // Upload gambar ke Cloudinary jika ada file yang di-upload
    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file.path); // Upload ke Cloudinary

      // Hapus file gambar dari folder 'uploads' setelah berhasil di-upload ke Cloudinary
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted from local storage');
        }
      });
    }

    const techArray = Array.isArray(technologies) ? technologies : [technologies];

    // Simpan data proyek ke database, hanya menyimpan URL gambar
    await Project.create({
      projectName,
      startDate,
      endDate,
      description,
      technologies: techArray,
      imageUrl // Hanya menyimpan URL dari Cloudinary
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).send('An error occurred while saving the project.');
  }
});

// Fungsi untuk menghapus file lokal
const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting local file:', err);
    } else {
      console.log('Local file deleted:', filePath);
    }
  });
};

// Route untuk mengupdate proyek
app.put('/api/projects/:id', isAuthenticated, upload.single('uploadImage'), async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  const { projectName, startDate, endDate, description, technologies } = req.body;

  try {
    // Temukan proyek berdasarkan ID
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Hapus gambar lama dari Cloudinary jika ada
    if (project.imageUrl) {
      const oldPublicId = project.imageUrl.split('/').slice(-2).join('/').split('.')[0];
      await deleteImageFromCloudinary(oldPublicId);
    }

    // Update proyek dengan data baru
    project.projectName = projectName;
    project.startDate = startDate;
    project.endDate = endDate;
    project.description = description;
    project.technologies = JSON.parse(technologies);

    // Jika ada gambar baru diupload, update image URL
    if (req.file) {
      const newImageUrl = await uploadImageToCloudinary(req.file.path); // Upload gambar baru ke Cloudinary
      project.imageUrl = newImageUrl;
      // Hapus file lokal setelah upload ke Cloudinary
      deleteLocalFile(req.file.path);
    }

    // Simpan perubahan
    await project.save();

    res.status(200).send('Project updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('An error occurred while updating the project.');
  }
});

//--------------FILE YANG DI UPLOAD KE CLOUD--------------//

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

//---------------
app.delete('/api/projects/:id', isAuthenticated, async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  try {
    // Temukan proyek berdasarkan ID
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Hapus gambar dari Cloudinary jika ada
    if (project.imageUrl) {
      const publicId = project.imageUrl.split('/').slice(-2).join('/').split('.')[0];
      await deleteImageFromCloudinary(publicId);
    }

    // Hapus proyek dari database
    await Project.destroy({ where: { id: projectId } });
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the project.' });
  }
});

//--------------

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
