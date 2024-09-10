document.addEventListener('DOMContentLoaded', function () {
  // Ambil ID proyek dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = +urlParams.get('editId');

  // Muat data proyek yang akan diedit
  function loadProjectData() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const project = projects.find(proj => proj.id == projectId);

    if (!project) {
      alert('Project not found!');
      window.location.href = '/';
      return;
    }

    // Isi form dengan data proyek
    document.getElementById('projectName').value = project.projectName;
    document.getElementById('startDate').value = project.startDate;
    document.getElementById('endDate').value = project.endDate;
    document.getElementById('description').value = project.description;

    // Centang teknologi yang digunakan
    project.technologies.forEach(tech => {
      document.querySelector(`input[value="${tech}"]`).checked = true;
    });

    // Tampilkan gambar yang sudah ada
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = project.imageUrl;
    imagePreview.style.display = project.imageUrl ? 'block' : 'none';

    // Simpan URL gambar yang sudah ada jika tidak ingin mengganti gambar
    document.getElementById('uploadImage').dataset.existingImage = project.imageUrl;
  }

  // Fungsi untuk menangani gambar yang diunggah
  document.getElementById('uploadImage').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        document.getElementById('imagePreview').src = reader.result;
        document.getElementById('imagePreview').style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // Fungsi untuk menyimpan perubahan ke localStorage
  document.getElementById('projectForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const projectName = document.getElementById('projectName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const description = document.getElementById('description').value;
    const technologies = Array.from(document.querySelectorAll('input[name="technologies"]:checked')).map(el => el.value);

    const fileInput = document.getElementById('uploadImage');
    const existingImage = fileInput.dataset.existingImage;
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onloadend = function () {
      const imageUrl = file ? reader.result : existingImage; // Gunakan gambar baru jika ada, atau gambar lama jika tidak

      // Update proyek di localStorage
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      const projectIndex = projects.findIndex(proj => proj.id == projectId);

      if (projectIndex > -1) {
        projects[projectIndex] = {
          id: +projectId,
          projectName,
          startDate,
          endDate,
          description,
          technologies,
          imageUrl
        };

        localStorage.setItem('projects', JSON.stringify(projects));
        window.location.href = '/'; // Kembali ke halaman utama setelah berhasil edit
      } else {
        alert('Proyek tidak ditemukan!');
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      reader.onloadend(); // Gunakan gambar lama jika tidak ada file baru
    }
  });

  // Muat data proyek saat halaman dimuat
  loadProjectData();
});
