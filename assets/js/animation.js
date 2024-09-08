document.addEventListener("DOMContentLoaded", function () {
  const animatedBox = document.querySelector(".animated-box");

  // Fungsi untuk memulai animasi berulang
  function animateBox() {
    animatedBox.style.opacity = 1;
    animatedBox.style.transform = "scale(1)";
  }

  // Animasi pernapasan yang berulang dengan skala
  function breatheAnimation() {
    let scaleUp = true;
    setInterval(function () {
      if (scaleUp) {
        animatedBox.style.transform = "scale(1.2)";
      } else {
        animatedBox.style.transform = "scale(1)";
      }
      scaleUp = !scaleUp;
    }, 1000); // Ubah skala setiap 1 detik
  }

  // Memulai animasi saat halaman selesai dimuat
  setTimeout(function () {
    animateBox();
    breatheAnimation();
  }, 500);
});
