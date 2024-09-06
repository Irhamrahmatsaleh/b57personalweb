// Fungsi untuk memuat dan menampilkan proyek dari localStorage
function loadProjects() {
  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  const projectContainer = document.querySelector('.project-section .row');

  projectContainer.innerHTML = '';

  projects.forEach((project) => {
    const card = document.createElement('div');
    card.classList.add('card', 'col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'm-2', 'p-0', 'shadow-sm');

    card.innerHTML = `
      <img src="${project.imageUrl}" class="card-img-top" alt="Project Image">
      <div class="card-body">
        <h2 class="card-title h5">${project.projectName}</h2>
        <p class="card-text">${new Date(project.startDate).getFullYear()}</p>
        <p class="card-text">Duration: ${getProjectDuration(project.startDate, project.endDate)}</p>
        <p class="card-text">${project.description}</p>
        <div class="icons mb-3">
          ${project.technologies.map(tech => `<i class="fab fa-${tech.toLowerCase()} mx-1"></i>`).join('')}
        </div>
        <div class="d-flex justify-content-between">
          <button class="btn btn-warning edit btn-sm" data-id="${project.id}">Edit</button>
          <button class="btn btn-danger delete btn-sm" data-id="${project.id}">Delete</button>
        </div>
      </div>
    `;

    card.addEventListener('click', function (e) {
      if (!e.target.classList.contains('edit') && !e.target.classList.contains('delete')) {
        window.location.href = `project-detail.html?id=${project.id}`;
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

// Fungsi untuk mengedit proyek (sementara diarahkan kembali ke form addProject.html untuk update)
function editProject(projectId) {
  window.location.href = `update-my-project.html?editId=${projectId}`;
}

// Load projects on page load
document.addEventListener('DOMContentLoaded', loadProjects);
