
// const express = require('express');
// const path = require('path');
// const { engine } = require('express-handlebars');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Data statis untuk proyek
// const staticProjects = [
//   {
//     id: 1001,
//     projectName: "Static E-Commerce Project",
//     startDate: "2023-05-01",
//     endDate: "2023-08-01",
//     description: "Jika Anda ingin memodifikasi proyek, silakan buat proyek baru dengan menekan menu 'Add Project'. Anda dapat menambahkan proyek apa pun di halaman ini dengan kontrol penuh. Fitur CRUD (Create, Read, Update, Delete) yang tersedia memungkinkan Anda untuk Menambahkan nama proyek, tanggal mulai, tanggal selesai, deskripsi, teknologi, dan foto. Mengedit informasi proyek yang telah ada. Menghapus proyek yang tidak diperlukan. Silakan jelajahi website kami dan jika Anda menemukan bug atau kesalahan pada fungsionalitas, hubungi kami melalui formulir Contact Me. Kami akan dengan senang hati menerima masukan Anda.",
//     technologies: ["html5", "css3", "js"],
//     imageUrl: "/img/projectStaticImage/e-commerce.jpg"
//   },
//   {
//     id: 1002,
//     projectName: "Static Android Project",
//     startDate: "2022-01-15",
//     endDate: "2022-03-15",
//     description: "Jika Anda ingin memodifikasi proyek, silakan buat proyek baru dengan menekan menu 'Add Project'. Anda dapat menambahkan proyek apa pun di halaman ini dengan kontrol penuh. Fitur CRUD (Create, Read, Update, Delete) yang tersedia memungkinkan Anda untuk Menambahkan nama proyek, tanggal mulai, tanggal selesai, deskripsi, teknologi, dan foto. Mengedit informasi proyek yang telah ada. Menghapus proyek yang tidak diperlukan. Silakan jelajahi website kami dan jika Anda menemukan bug atau kesalahan pada fungsionalitas, hubungi kami melalui formulir Contact Me. Kami akan dengan senang hati menerima masukan Anda.",
//     technologies: ["React", "Java", "Python", "nodejs"],
//     imageUrl: "/img/projectStaticImage/android.jpg"
//   },
//   {
//     id: 1003,
//     projectName: "Static IOS Project",
//     startDate: "2022-01-15",
//     endDate: "2022-05-15",
//     description: "Jika Anda ingin memodifikasi proyek, silakan buat proyek baru dengan menekan menu 'Add Project'. Anda dapat menambahkan proyek apa pun di halaman ini dengan kontrol penuh. Fitur CRUD (Create, Read, Update, Delete) yang tersedia memungkinkan Anda untuk Menambahkan nama proyek, tanggal mulai, tanggal selesai, deskripsi, teknologi, dan foto. Mengedit informasi proyek yang telah ada. Menghapus proyek yang tidak diperlukan. Silakan jelajahi website kami dan jika Anda menemukan bug atau kesalahan pada fungsionalitas, hubungi kami melalui formulir Contact Me. Kami akan dengan senang hati menerima masukan Anda.",
//     technologies: ["React", "Java", "Python", "nodejs"],
//     imageUrl: "/img/projectStaticImage/ios.jpg"
//   }
// ];

// // Fungsi untuk menghitung durasi proyek dalam bulan
// function getProjectDuration(startDate, endDate) {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)); // Durasi dalam bulan
//   return `${duration} months`;
// }

// // Setup Handlebars view engine dengan helper
// const hbs = engine({
//   extname: 'hbs',
//   helpers: {
//     includes: function (array, value) {
//       return array.includes(value);
//     }
//   }
// });

// app.engine('hbs', hbs);
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));

// // Middleware untuk parsing form data
// app.use(express.urlencoded({ extended: true }));

// // Static files
// app.use(express.static(path.join(__dirname, 'assets')));

// // Routes
// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.get('/addProject', (req, res) => {
//   res.render('addProject');
// });

// app.post('/addProject', (req, res) => {
//   // Ambil data dari form
//   const { projectName, startDate, endDate, description, technologies } = req.body;

//   // Tampilkan data ke terminal
//   console.log('Project Name:', projectName);
//   console.log('Start Date:', startDate);
//   console.log('End Date:', endDate);
//   console.log('Description:', description);
//   console.log('Technologies:', technologies);

//   // Redirect atau tampilkan pesan sukses
//   res.send('Project data received. Check your terminal.');
// });

// app.get('/contact', (req, res) => {
//   res.render('contact');
// });

// app.get('/project-detail', (req, res) => {
//   const projectId = parseInt(req.query.id); // Ambil ID proyek dari query parameter
//   const project = staticProjects.find(proj => proj.id === projectId);

//   if (project) {
//     res.render('project-detail', {
//       projectTitle: project.projectName,
//       projectImage: project.imageUrl,
//       dateRange: `${new Date(project.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(project.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
//       timeDuration: getProjectDuration(project.startDate, project.endDate),
//       projectDescription: project.description,
//       technologies: project.technologies
//     });
//   } else {
//     res.status(404).send('Project not found');
//   }
// });

// app.get('/testimonials', (req, res) => {
//   res.render('testimonials');
// });

// app.get('/update-my-project', (req, res) => {
//   // Contoh data untuk testing
//   const project = {
//     projectName: 'Sample Project',
//     startDate: '2024-01-01',
//     endDate: '2024-12-31',
//     description: 'This is a sample project description.',
//     technologies: ['Node.js', 'React.js'],
//     imageUrl: '/path/to/image.jpg',
//     selectedTechnologies: ['Node.js', 'React.js']
//   };

//   // Data teknologi untuk checkbox
//   const technologies = [
//     { id: 'nodejs', value: 'Node.js', label: 'Node.js' },
//     { id: 'reactjs', value: 'React.js', label: 'React.js' },
//     { id: 'nextjs', value: 'Next.js', label: 'Next.js' },
//     { id: 'typescript', value: 'TypeScript', label: 'TypeScript' },
//     { id: 'angular', value: 'Angular', label: 'Angular' },
//     { id: 'java', value: 'Java', label: 'Java' }
//   ];

//   res.render('update-my-project', {
//     projectName: project.projectName,
//     startDate: project.startDate,
//     endDate: project.endDate,
//     description: project.description,
//     technologies: technologies,
//     selectedTechnologies: project.selectedTechnologies,
//     imageUrl: project.imageUrl
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
