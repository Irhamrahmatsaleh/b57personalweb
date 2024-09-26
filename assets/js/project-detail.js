

function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadProjectDetails() {
  const projectId = getQueryParameter('id');

  if (!projectId) {
    console.error('No project ID found in URL');
    return;
  }

  try {
    const response = await fetch(`/project-detail?id=${projectId}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const project = await response.json();

    if (!project) {
      console.error('Project not found');
      alert('DIHARAPKAN UNTUK MEMBUAT PROJECT SENDIRI');
      window.location.href = '/';
      return;
    }

    document.getElementById('projectTitle').textContent = project.projectTitle;
    document.getElementById('projectImage').src = project.projectImage;

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
    document.getElementById('projectDescription').textContent = project.projectDescription;

    const techList = document.getElementById('techList');
    techList.innerHTML = '';
    project.technologies.forEach(tech => {
      const li = document.createElement('li');
      li.textContent = tech;
      techList.appendChild(li);
    });
  } catch (error) {
    // console.error('Error fetching project data:', error);
    // alert('Terjadi kesalahan saat memuat data proyek.');
  }
}

function getProjectDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)); // Durasi dalam bulan
  return `${duration} months`;
}

document.addEventListener('DOMContentLoaded', loadProjectDetails);
