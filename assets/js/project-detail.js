
//-------------------------------------------------------------

// Fungsi untuk mendapatkan nilai parameter query dari URL
function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fungsi untuk memuat detail proyek berdasarkan ID dari localStorage
function loadProjectDetails() {
  const projectId = getQueryParameter('id');

  if (!projectId) {
    console.error('No project ID found in URL');
    return;
  }

  // Ambil data proyek dari localStorage
  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  const project = projects.find(proj => proj.id === parseInt(projectId));

  if (!project) {
    console.error('Project not found');
    alert('DIHARAPKAN UNTUK MEMBUAT PROJECT SENDIRI');
    window.location.href = '/';
    return;
  }

  // Isi elemen di halaman dengan detail proyek
  document.getElementById('projectTitle').textContent = project.projectName;
  document.getElementById('projectImage').src = project.imageUrl;

  // Format tanggal menjadi "9 Sep 2024 - 6 Nov 2024"
  const formattedStartDate = new Date(project.startDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const formattedEndDate = new Date(project.endDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  document.getElementById('dateRange').textContent = `${formattedStartDate} - ${formattedEndDate}`;
  document.getElementById('timeDuration').textContent = getProjectDuration(project.startDate, project.endDate);
  document.getElementById('projectDescription').textContent = project.description;

  // Tampilkan teknologi yang digunakan
  const techList = document.getElementById('techList');
  techList.innerHTML = ''; // Bersihkan terlebih dahulu
  project.technologies.forEach(tech => {
    const li = document.createElement('li');
    li.textContent = tech;
    techList.appendChild(li);
  });
}

// Fungsi untuk menghitung durasi proyek dalam bulan
function getProjectDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)); // Durasi dalam bulan
  return `${duration} months`;
}

// Muat detail proyek ketika halaman dimuat
document.addEventListener('DOMContentLoaded', loadProjectDetails);
