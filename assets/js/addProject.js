
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


$(document).ready(function () {
  $('#projectForm').on('submit', function (e) {
    e.preventDefault();

    $('#loading').show();

    var formData = new FormData(this);

    $.ajax({
      url: $(this).attr('action'),
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        window.location.href = '/';
      },
      error: function (xhr, status, error) {
        alert('An error occurred while uploading.');
      },
      complete: function () {
        $('#loading').hide();
      }
    });
  });
});
