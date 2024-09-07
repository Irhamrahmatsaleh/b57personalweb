// Simpan data proyek ke localStorage
document.getElementById('projectForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Ambil nilai dari form
  const projectName = document.getElementById('projectName').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const description = document.getElementById('description').value;
  const technologies = Array.from(document.querySelectorAll('input[name="technologies"]:checked')).map(el => el.value);

  // Simpan gambar
  const fileInput = document.getElementById('uploadImage');
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    const imageUrl = reader.result;

    // Buat objek proyek
    const project = {
      id: Date.now(),
      projectName,
      startDate,
      endDate,
      description,
      technologies,
      imageUrl
    };

    // Simpan ke localStorage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.unshift(project);
    localStorage.setItem('projects', JSON.stringify(projects));

    // Redirect ke index.html
    window.location.href = 'index.html';
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});
