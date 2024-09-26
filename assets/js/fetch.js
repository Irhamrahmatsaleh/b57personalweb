// Fetch data using Fetch API
fetch("https://api.npoint.io/456f10355d616c72db01")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    displayTestimonials(data);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

function displayTestimonials(testimonials) {
  let testimonialsContainer = document.getElementById('testimonials');
  testimonialsContainer.innerHTML = '';

  testimonials.forEach(function (testimonial) {
    let card = document.createElement('div');
    card.classList.add('testimonial');

    let stars = '';
    for (let i = 0; i < testimonial.rating; i++) {
      stars += '<i class="fas fa-star"></i>';
    }

    let name = testimonial.name || 'Anonymous';
    let message = testimonial.message || 'No message provided.';
    let image = testimonial.image || 'https://via.placeholder.com/150';

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
  fetch("https://api.npoint.io/456f10355d616c72db01")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (starRating === 'all') {
        displayTestimonials(data);
      } else {
        let filteredData = data.filter(function (testimonial) {
          return testimonial.rating == starRating;
        });
        displayTestimonials(filteredData);
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}
