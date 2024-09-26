
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('editId');

async function loadProjectData(projectId) {
  try {
    const response = await fetch(`/api/projects/${projectId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project data');
    }

    const project = await response.json();

    document.getElementById('projectName').value = project.projectName;
    document.getElementById('startDate').value = project.startDate.split('T')[0];
    document.getElementById('endDate').value = project.endDate.split('T')[0];
    document.getElementById('description').value = project.description;

    const techCheckboxes = document.querySelectorAll('input[name="technologies"]');
    project.technologies.forEach(tech => {
      techCheckboxes.forEach(checkbox => {
        if (checkbox.value === tech) {
          checkbox.checked = true;
        }
      });
    });

    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = project.imageUrl;
    imagePreview.style.display = 'block';

  } catch (error) {
    console.error('Error loading project data:', error);
  }
}

async function saveProjectData(event) {
  event.preventDefault();

  document.getElementById('loading').style.display = 'flex';

  const projectName = document.getElementById('projectName').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const description = document.getElementById('description').value;
  const technologies = Array.from(document.querySelectorAll('input[name="technologies"]:checked')).map(checkbox => checkbox.value);

  const formData = new FormData();
  formData.append('projectName', projectName);
  formData.append('startDate', startDate);
  formData.append('endDate', endDate);
  formData.append('description', description);
  formData.append('technologies', JSON.stringify(technologies));

  const uploadImage = document.getElementById('uploadImage').files[0];
  if (uploadImage) {
    formData.append('uploadImage', uploadImage);
  }

  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: formData
    });

    if (response.ok) {
      window.location.href = '/';
    } else {
      alert('Harap login untuk memperbarui proyek');
    }
  } catch (error) {
    console.error('Error updating project:', error);
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (projectId) {
    loadProjectData(projectId);
  }

  document.getElementById('projectForm').addEventListener('submit', saveProjectData);
});

//-------------------------
// Menampilkan preview gambar
document.getElementById('uploadImage').addEventListener('change', function () {
  const file = this.files[0];
  const reader = new FileReader();
  const imagePreview = document.getElementById('imagePreview');

  reader.onload = function (e) {
    imagePreview.src = e.target.result;
    imagePreview.style.display = 'block';
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    imagePreview.style.display = 'none';
  }
});
