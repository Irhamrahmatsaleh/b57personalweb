

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


//-------------------------
$(document).ready(function () {
  $('#projectForm').on('submit', function (e) {
    e.preventDefault(); // Cegah submit default

    // Tampilkan animasi loading
    $('#loading').show();

    // Buat objek FormData dari form
    var formData = new FormData(this);

    // Kirim data form menggunakan AJAX
    $.ajax({
      url: $(this).attr('action'),
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        // Redirect atau lakukan sesuatu setelah sukses
        window.location.href = '/';
      },
      error: function (xhr, status, error) {
        // Tangani error
        alert('An error occurred while uploading.');
      },
      complete: function () {
        // Sembunyikan animasi loading setelah selesai
        $('#loading').hide();
      }
    });
  });
});
