
function getProjectById(id) {
  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  return projects.find(project => project.id === id);
}

// Fungsi untuk menampilkan detail proyek di halaman project-detail.html
function displayProjectDetail() {
  const projectId = localStorage.getItem('currentProjectId');
  const project = getProjectById(projectId);

  if (project) {
    document.getElementById('projectTitle').textContent = project.name;
    document.getElementById('projectImage').src = project.image || 'https://via.placeholder.com/200';
    document.getElementById('projectDuration').textContent = `Duration`;
    // ${Math.round((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24 * 30))} month${Math.round((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24 * 30)) > 1 ? 's' : ''}`;

    // Format tanggal "31 Aug 2024"
    const formatDate = date => new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    document.getElementById('dateRange').textContent = `${formatDate(project.startDate)} - ${formatDate(project.endDate)}`;
    document.getElementById('timeDuration').textContent = `${Math.round((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24 * 30))} month${Math.round((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24 * 30)) > 1 ? 's' : ''}`;
    document.getElementById('projectDescription').textContent = project.description;

    const techList = document.getElementById('techList');
    techList.innerHTML = '';
    project.technologies.forEach(tech => {
      const li = document.createElement('li');
      li.textContent = tech;
      techList.appendChild(li);
    });

    // Tombol edit
    document.getElementById('editProjectBtn').addEventListener('click', () => {
      localStorage.setItem('editingProjectId', project.id);
      window.location.href = 'edit-project.html';
    });
  } else {
    // Jika proyek tidak ditemukan, arahkan kembali ke halaman utama
    window.location.href = 'index.html';
  }
}

// Tampilkan detail proyek saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayProjectDetail);

//888888
