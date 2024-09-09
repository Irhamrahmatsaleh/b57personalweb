// Menampilkan daftar proyek
function displayProjects() {
  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  const projectList = document.getElementById('projectList');

  projectList.innerHTML = ''; // Bersihkan daftar proyek

  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');

    // Card Content
    projectCard.innerHTML = `
      <h3>${project.projectName}</h3>
      <p>${project.description}</p>
      <button onclick="viewProject(${project.id})">View</button>
      <button onclick="editProject(${project.id})">Edit</button>
      <button onclick="deleteProject(${project.id})">Delete</button>
    `;

    projectList.appendChild(projectCard);
  });
}

// Tampilkan detail proyek
function viewProject(id) {
  window.location.href = `project-detail.html?projectId=${id}`;
}

// Edit proyek
function editProject(id) {
  window.location.href = `update-my-project.html?editId=${id}`;
}

// Hapus proyek
function deleteProject(id) {
  let projects = JSON.parse(localStorage.getItem('projects')) || [];
  projects = projects.filter(proj => proj.id !== id);
  localStorage.setItem('projects', JSON.stringify(projects));
  displayProjects(); // Update tampilan setelah hapus
}

// Muat daftar proyek saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayProjects);
