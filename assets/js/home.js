
function loadProjects() {
  // Data statis untuk ditampilkan di awal
  const staticProjects = [
    {
      id: 1001,
      projectName: "Static E-Commerce Project",
      startDate: "2023-05-01",
      endDate: "2023-08-01",
      description: "\"Jika Anda ingin memodifikasi proyek, silakan buat proyek baru dengan menekan menu 'Add Project' \".",
      technologies: ["html5", "css3", "js"],
      imageUrl: "./img/projectStaticImage/e-commerce.jpg"
    },
    {
      id: 1002,
      projectName: "Static Android Project",
      startDate: "2022-01-15",
      endDate: "2022-03-15",
      description: "\"Jika Anda ingin memodifikasi proyek, silakan buat proyek baru dengan menekan menu 'Add Project' \".",
      technologies: ["react", "nodejs"],
      imageUrl: "./img/projectStaticImage/android.jpg"
    },
    {
      id: 1003,
      projectName: "Static IOS Project",
      startDate: "2022-01-15",
      endDate: "2022-05-15",
      description: "\"Jika Anda ingin memodifikasi proyek, silakan buat proyek baru dengan menekan menu 'Add Project' \".",
      technologies: ["react", "nodejs"],
      imageUrl: "./img/projectStaticImage/ios.jpg"
    }
  ];
  //------------------------------------------------

  //------------------------------------------------


  // Data dari localStorage (proyek yang ditambahkan user)
  const projects = JSON.parse(localStorage.getItem('projects')) || [];


  // Gabungkan proyek statis dan proyek dari localStorage
  const allProjects = [...projects, ...staticProjects];

  const projectContainer = document.querySelector('.project-section .row');
  projectContainer.innerHTML = '';

  allProjects.forEach((project) => {
    const card = document.createElement('div');
    card.classList.add('card', 'col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'm-2', 'p-0', 'shadow-sm');

    // Batasi deskripsi yang ditampilkan hanya 100 karakter
    const shortDescription = project.description.length > 100
      ? project.description.substring(0, 100) + '...'
      : project.description;

    card.innerHTML = `
  <img src="${project.imageUrl}" class="card-img-top" alt="Project Image">
  <div class="card-body shadow">
    <h2 class="card-title h5">${project.projectName}</h2>
    <p class="card-text">${new Date(project.startDate).getFullYear()}</p>
    <p class="card-text">Duration: ${getProjectDuration(project.startDate, project.endDate)}</p>
    <p class="card-text">${shortDescription}</p> <!-- Tampilkan deskripsi pendek -->
    <div class="icons mb-3">
      ${project.technologies.map(tech => `<i class="fab fa-${tech.toLowerCase()} mx-1"></i>`).join('')}
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <!-- Ikon tambahan -->
      <div style="font-size: 20px;">
        <i class="fab fa-google-play mx-2" style="color: green;"></i> <!-- Play Store Icon -->
        <i class="fab fa-android mx-2" style="color: lime;"></i> <!-- Android Icon -->
        <i class="fab fa-java mx-2" style="color: orange;"></i> <!-- Java Icon -->
      </div>
      <!-- Tombol Edit dan Delete -->
      <div>
        <button class="btn btn-warning edit btn-sm" data-id="${project.id}">Edit</button>
        <button class="btn btn-danger delete btn-sm" data-id="${project.id}">Delete</button>
      </div>
    </div>
  </div>
`;

    card.addEventListener('click', function (e) {
      if (!e.target.classList.contains('edit') && !e.target.classList.contains('delete')) {
        window.location.href = `project-detail?id=${project.id}`;
      }
    });

    projectContainer.appendChild(card);
  });

  // Event listener untuk tombol Delete
  document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      const projectId = this.dataset.id;
      deleteProject(projectId);
    });
  });

  // Event listener untuk tombol Edit
  document.querySelectorAll('.edit').forEach(button => {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      const projectId = this.dataset.id;
      editProject(projectId);
    });
  });
}

// Fungsi untuk menghitung durasi proyek
function getProjectDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)); // Durasi dalam bulan
  return `${duration} months`;
}

// Fungsi untuk menghapus proyek
function deleteProject(projectId) {
  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  const updatedProjects = projects.filter(project => project.id !== parseInt(projectId));
  localStorage.setItem('projects', JSON.stringify(updatedProjects));
  loadProjects(); // Refresh tampilan
}

// Fungsi untuk mengedit proyek
function editProject(projectId) {
  window.location.href = `update-my-project?editId=${projectId}`;
}

// Load projects on page load
document.addEventListener('DOMContentLoaded', loadProjects);
