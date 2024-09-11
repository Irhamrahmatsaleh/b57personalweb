

// Menampilkan preview gambar
document.getElementById('uploadImage').addEventListener('change', function () {
  const file = this.files[0];
  const reader = new FileReader();
  const imagePreview = document.getElementById('imagePreview');

  reader.onload = function (e) {
    imagePreview.src = e.target.result;
    imagePreview.style.display = 'block'; // Tampilkan gambar
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    imagePreview.style.display = 'none'; // Sembunyikan gambar jika tidak ada file
  }
});
