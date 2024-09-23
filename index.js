const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const session = require('express-session');
const sessionStore = require('connect-session-sequelize')(session.Store);
const cloudinary = require('cloudinary').v2;
const flash = require('connect-flash');
const streamifier = require('streamifier');
const { Pool } = require('pg');
require('dotenv').config();


// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}


const app = express();
const PORT = process.env.PORT || 3000;

// Setup Sequelize
// const sequelize = new Sequelize(process.env.DATABASE_URL);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // Menentukan dialect yang digunakan
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database query error:', err);
  } else {
    console.log('Database connection successful:', res.rows[0]);
  }
});

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  imageUrl: DataTypes.STRING
});

const Project = sequelize.define('Project', {
  projectName: DataTypes.STRING,
  authorName: DataTypes.STRING,
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  description: DataTypes.TEXT,
  technologies: DataTypes.ARRAY(DataTypes.STRING),
  imageUrl: DataTypes.STRING,
  authorId: DataTypes.INTEGER
});

sequelize.sync()
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Database synchronization error:', err));

const sessionStoreInstance = new sessionStore({
  db: sequelize,
});

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  store: sessionStoreInstance,
}));
sessionStoreInstance.sync();

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.use((req, res, next) => {
  res.locals.userName = req.session.userName;
  res.locals.userImage = req.session.userImage;
  next();
});

app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static('uploads'));

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

app.get('/', async (req, res) => {
  const projects = await Project.findAll();
  res.render('index', {
    projects,
    userName: req.session.userName
  });
});

app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render('login');
});

app.get('/register', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render('register');
});

app.post('/register', upload.single('imageUrl'), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('register', {
        errorMessage: 'Email already exists',
        name, // Mengisi kembali form dengan data sebelumnya
        email
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

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


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('login', { errorMessage: 'Email does not exist' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render('login', { errorMessage: 'Wrong password' });
    }

    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userImage = user.imageUrl + '?v=' + new Date().getTime();
    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login');
  }
});

app.get('/profile', isAuthenticated, async (req, res) => {
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

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('An error occurred while logging out.');
    }
    res.redirect('/');
  });
});

app.get('/addProject', isAuthenticated, (req, res) => {
  console.log(req.session.userName);
  res.render('addProject', {
    userName: req.session.userName,
    isAddProjectOrDetailOrUpdate: true,
    userImage: req.session.userImage
  });
});

app.post('/addProject', isAuthenticated, upload.single('uploadImage'), async (req, res) => {
  try {
    const { projectName, authorName, startDate, endDate, description, technologies } = req.body;
    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      publicId = result.public_id; // Simpan public_id dari Cloudinary
    }

    const authorId = req.session.userId;
    const techArray = Array.isArray(technologies) ? technologies : [technologies];
    console.log(authorName);
    await Project.create({
      projectName,
      authorName,
      startDate,
      endDate,
      description,
      technologies: techArray,
      imageUrl,
      authorId,
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).send('An error occurred while saving the project.');
  }
});


// Route untuk mengupdate proyek
app.get('/api/projects/:id', async (req, res) => {
  const projectId = parseInt(req.params.id, 10);

  if (isNaN(projectId)) {
    return res.status(400).send('Invalid project ID');
  }

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    res.json(project); // Kirim data proyek sebagai JSON
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).send('An error occurred while fetching the project.');
  }
});

app.put('/api/projects/:id', isAuthenticated, upload.single('uploadImage'), async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  const { projectName, startDate, endDate, description, technologies } = req.body;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    project.projectName = projectName;
    project.startDate = new Date(startDate);
    project.endDate = new Date(endDate);
    project.description = description;

    if (technologies) {
      try {
        project.technologies = JSON.parse(technologies);
      } catch (err) {
        console.error('Error parsing technologies:', err);
        return res.status(400).send('Invalid technologies format');
      }
    }

    if (req.file) {
      if (project.imageUrl) {
        const oldPublicId = project.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(oldPublicId);
      }

      const result = await uploadToCloudinary(req.file.buffer);
      project.imageUrl = result.secure_url;
    }

    await project.save();

    res.status(200).send('Project updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('An error occurred while updating the project.');
  }
});


app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).send('An error occurred while fetching projects.');
  }
});

app.get('/getUsername', async (req, res) => {
  return res.json({
    userName: req.session.userName,
  });
});

// Route untuk menghapus PROYEK
app.delete('/api/projects/:id', isAuthenticated, async (req, res) => {
  const projectId = parseInt(req.params.id, 10);

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    if (project.imageUrl) {
      const publicId = project.imageUrl.split('/').slice(-1)[0].split('.')[0];
      console.log("Deleting image with publicId:", publicId); // Log untuk memastikan publicId benar

      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary delete response:", result); // Log untuk melihat respons Cloudinary
    }

    await project.destroy();
    res.status(204).send('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).send('An error occurred while deleting the project.');
  }
});



app.get('/contact', (req, res) => {
  res.render('contact', {
    userName: req.session.userName
  });
});

app.get('/testimonials', (req, res) => {
  res.render('testimonials', {
    userName: req.session.userName
  });
});


app.get('/update-my-project', (req, res) => {
  res.render('update-my-project', {
    userName: req.session.userName
  });
});

//DETAIL PROJECT
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = Math.abs(end - start);
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Hitung selisih hari
  const monthsDiff = Math.floor(daysDiff / 30); // Kira-kira hitung bulan
  const daysRemaining = daysDiff % 30;

  return `${monthsDiff} months and ${daysRemaining} days`;
}

app.get('/project-detail', async (req, res) => {
  const projectId = parseInt(req.query.id, 10);
  if (!projectId) {
    return res.status(400).send('Project ID is required');
  }

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
      authorName: project.authorName,
      userName: req.session.userName
    };

    res.render('project-detail', projectData);
  } catch (err) {
    console.error('Error fetching project data:', err);
    res.status(500).send('Server error');
  }
});

//-------------UNTUK BAGIAN PROFILE----------------------//
app.post('/uploadProfileImage', isAuthenticated, upload.single('imageUrl'), async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.imageUrl) {
      const oldPublicId = user.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(oldPublicId);
    }

    const result = await uploadToCloudinary(req.file.buffer);
    user.imageUrl = result.secure_url;

    await user.save();

    res.redirect('/profile');
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).send('An error occurred while uploading the image.');
  }
});

app.get('/deleteImageProfile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.imageUrl) {
      const oldPublicId = user.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(oldPublicId);
    }

    user.imageUrl = null;
    await user.save();

    res.redirect('/profile');
  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).send('An error occurred while deleting the image.');
  }
});


app.post('/editProfile', isAuthenticated, async (req, res) => {
  const { userName, email, oldPassword } = req.body;

  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/profile');
    }

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Incorrect old password');
      return res.redirect('/profile');
    }

    if (userName) {
      user.name = userName;
    }

    if (email) {
      user.email = email;
    }

    await user.save();

    await Project.update(
      { authorName: userName },
      { where: { authorId: user.id } }
    );

    req.flash('success_msg', 'Profile updated successfully');
    res.redirect('/profile'); // Redirect ke halaman profil setelah update
  } catch (error) {
    console.error('Error editing profile:', error);
    req.flash('error_msg', 'An error occurred while editing the profile.');
    res.redirect('/profile');
  }
});


//-------------UNTUK BAGIAN PROFILE----------------------//

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
