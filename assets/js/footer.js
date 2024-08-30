// Mendapatkan elemen dengan id 'current-year'
const currentYearElement = document.getElementById('current-year');

// Mendapatkan tahun saat ini
const currentYear = new Date().getFullYear();

// Menampilkan tahun saat ini di elemen 'current-year'
currentYearElement.textContent = currentYear;
