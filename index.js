const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const multer = require('multer');
const { Sequelize, DataTypes } = require('sequelize');
const { uploadImageToCloudinary, deleteImageFromCloudinary, uploadToCloudinary, uploadImage, deleteImage } = require('./uploads/cloudinaryUpload');
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
 const sequelize = new Sequelize("postgres://default:9iLBHb4hpXNr@ep-frosty-night-a4dht1wi.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require");


// Define User and Project models
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  imageUrl: DataTypes.STRING
});

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

app.use((req, res, next) => {
  res.locals.userName = req.session.userName;
  res.locals.userImage = req.session.userImage;
  next();
});


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

// Route untuk halaman register
app.get('/register', (req, res) => {
  res.render('register');
});

// Route untuk menangani register
app.post('/register', upload.single('imageUrl'), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah ada
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('register', {
        errorMessage: 'Email is already registered.',
        name,
        email
      });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image ke Cloudinary dari folder lokal
    let imageUrl = null;
    if (req.file) {
      const filePath = req.file.path; // Path file lokal
      imageUrl = await uploadToCloudinary(filePath, 'uploads'); // Upload ke Cloudinary
      fs.unlinkSync(filePath); // Hapus file dari folder lokal setelah upload ke Cloudinary
    }

    // Simpan user baru di PostgreSQL
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
    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Jika user tidak ditemukan, kirim pesan kesalahan
      return res.render('login', { errorMessage: 'Email does not exist' });
    }

    // Bandingkan password yang dimasukkan dengan password yang tersimpan
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      // Jika password salah, kirim pesan kesalahan
      return res.render('login', { errorMessage: 'Wrong password' });
    }

    // Jika password benar, simpan session dan arahkan ke dashboard atau halaman lain
    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userImage = user.imageUrl + "?v=" + new Date().getTime();
    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login');
  }
});

// Route untuk menampilkan halaman profil
app.get('/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findByPk(req.session.userId);
    res.render('profilePage', {
      userName: user.name,
      userImage: user.imageUrl,
      email: user.email
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('An error occurred while fetching the profile.');
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

// Route untuk halaman home
app.get('/', async (req, res) => {
  const projects = await Project.findAll();
  res.render('index', {
    projects,
    userName: req.session.userName
  });
});

// Route untuk halaman addProject
app.get('/addProject', (req, res) => {
  res.render('addProject', {
    userName: req.session.userName,
    isAddProjectOrDetailOrUpdate: true,
    userImage: req.session.userImage
  });
});

// Route untuk menambahkan project
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
// delete project
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

// Route untuk mengupdate project
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
      projectDescription: project.description,
      userName: req.session.userName
    };

    res.render('project-detail', projectData);
  } catch (err) {
    console.error('Error fetching project data:', err);
    res.status(500).send('Server error');
  }
});

// Fungsi untuk menghitung durasi proyek
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMs = end - start;
  const diffInMonths = diffInMs / (1000 * 60 * 60 * 24 * 30);
  return `${Math.round(diffInMonths)} months`;
}

// Route untuk halaman contact
app.get('/contact', (req, res) => {
  res.render('contact', {
    userName: req.session.userName
  });
});

// Route untuk halaman testimonials
app.get('/testimonials', (req, res) => {
  res.render('testimonials', {
    userName: req.session.userName
  });
});


// Route untuk halaman update-my-project
app.get('/update-my-project', (req, res) => {
  res.render('update-my-project', {
    userName: req.session.userName
  });
});

// Route untuk menangani upload gambar profil
app.post('/uploadProfileImage', upload.single('imageUrl'), async (req, res) => {
  try {
    if (!req.file) {
      return res.redirect('/profile'); // Tidak ada file yang diupload, kembali ke halaman profil
    }

    // Upload image to Cloudinary
    const result = await uploadImage(req.file.path);

    // Ambil URL gambar
    const imageUrl = result.secure_url;

    // Update user dengan gambar baru
    await User.update({ imageUrl }, { where: { id: req.session.userId } });

    // Hapus gambar lokal setelah diupload
    fs.unlinkSync(req.file.path);

    // Redirect kembali ke halaman profil
    res.redirect('/profile');
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).send('An error occurred while uploading the image.');
  }
});

delete imgae
app.get('/deleteImageProfile', async (req, res) => {
  try {
    // Ambil user dari database
    const user = await User.findByPk(req.session.userId);

    // Jika user memiliki gambar, hapus dari Cloudinary
    if (user.imageUrl) {
      const publicId = user.imageUrl.split('/').pop().split('.')[0]; // Mendapatkan public_id dari URL gambar
      await deleteImage(publicId); // Hapus gambar dari Cloudinary
    }

    // Update URL gambar user menjadi gambar default
    await User.update({ imageUrl: 'default_image_url' }, { where: { id: req.session.userId } });

    // Redirect kembali ke halaman profil
    res.redirect('/profile');
  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).send('An error occurred while deleting the image.');
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
