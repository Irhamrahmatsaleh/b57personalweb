
function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function loadProjectDetails() {
  const projectId = getQueryParameter('id');

  if (!projectId) {
    console.error('No project ID found in URL');
    return;
  }

  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  const project = projects.find(proj => proj.id === parseInt(projectId));

  if (!project) {
    console.error('Project not found');
    return;
  }

  document.getElementById('projectTitle').textContent = project.projectName;
  document.getElementById('projectImage').src = project.imageUrl;

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

  const techList = document.getElementById('techList');
  techList.innerHTML = '';
  project.technologies.forEach(tech => {
    const li = document.createElement('li');
    li.textContent = tech;
    techList.appendChild(li);
  });
}

function getProjectDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30));
  return `${duration} months`;
}

document.addEventListener('DOMContentLoaded', loadProjectDetails);
