
let xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.npoint.io/456f10355d616c72db01", true);
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    let data = JSON.parse(xhr.responseText);
    displayTestimonials(data);
  }
};
xhr.send();

function displayTestimonials(testimonials) {
  let testimonialsContainer = document.getElementById('testimonials');
  testimonialsContainer.innerHTML = ''; // Clear existing content

  testimonials.forEach(function (testimonial) {
    let card = document.createElement('div');
    card.classList.add('testimonial');

    // Create stars
    let stars = '';
    for (let i = 0; i < testimonial.rating; i++) {
      stars += '<i class="fas fa-star"></i>';
    }

    // Handle undefined data
    let name = testimonial.name || 'Anonymous';
    let message = testimonial.message || 'No message provided.';
    let image = testimonial.image || 'https://via.placeholder.com/150'; // Default image if not provided

    // Card content
    card.innerHTML = `
      <img class="profile-testimonial" src="${image}" alt="${name}">
      <h3 class="author">${name}</h3>
      <p class="quote">${message}</p>
      <div class="rating">${stars}</div>
    `;

    testimonialsContainer.appendChild(card);
  });
}

// Function to filter testimonials based on star rating
function filterTestimonials(starRating) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.npoint.io/456f10355d616c72db01", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let data = JSON.parse(xhr.responseText);
      if (starRating === 'all') {
        displayTestimonials(data);
      } else {
        let filteredData = data.filter(function (testimonial) {
          return testimonial.rating == starRating;
        });
        displayTestimonials(filteredData);
      }
    }
  };
  xhr.send();
}
