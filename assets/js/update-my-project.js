

// Ambil parameter ID dari URL
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('editId');

// Fungsi untuk mendapatkan data proyek berdasarkan ID
async function loadProjectData(projectId) {
  try {
    const response = await fetch(`/api/projects/${projectId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project data');
    }

    const project = await response.json();

    // Isi form dengan data proyek
    document.getElementById('projectName').value = project.projectName;
    document.getElementById('startDate').value = project.startDate.split('T')[0];
    document.getElementById('endDate').value = project.endDate.split('T')[0];
    document.getElementById('description').value = project.description;

    // Centang checkbox teknologi yang relevan
    const techCheckboxes = document.querySelectorAll('input[name="technologies"]');
    project.technologies.forEach(tech => {
      techCheckboxes.forEach(checkbox => {
        if (checkbox.value === tech) {
          checkbox.checked = true;
        }
      });
    });

    // Tampilkan gambar yang sudah diupload
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = project.imageUrl;
    imagePreview.style.display = 'block';

  } catch (error) {
    console.error('Error loading project data:', error);
  }
}

// Fungsi untuk menyimpan data proyek yang sudah diupdate
async function saveProjectData(event) {
  event.preventDefault(); // Mencegah reload halaman

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

  // Jika gambar diupload ulang
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
      alert('Project updated successfully!');
      window.location.href = '/'; // Kembali ke halaman utama setelah update
    } else {
      alert('Failed to update project');
    }
  } catch (error) {
    console.error('Error updating project:', error);
  }
}

// Load project data saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
  if (projectId) {
    loadProjectData(projectId);
  }

  // Pasang event listener untuk form submit
  document.getElementById('projectForm').addEventListener('submit', saveProjectData);
});
