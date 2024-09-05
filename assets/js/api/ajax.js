
// var xhr = new XMLHttpRequest();
// xhr.open("GET", "https://api.npoint.io/456f10355d616c72db01", true);
// xhr.onreadystatechange = function () {
//   if (xhr.readyState == 4 && xhr.status == 200) {
//     var data = JSON.parse(xhr.responseText);
//     displayTestimonials(data);
//   }
// };
// xhr.send();

// function displayTestimonials(testimonials) {
//   var testimonialsContainer = document.getElementById('testimonials');
//   testimonialsContainer.innerHTML = ''; // Clear existing content

//   testimonials.forEach(function (testimonial) {
//     var card = document.createElement('div');
//     card.classList.add('testimonial-card');

//     // Create stars
//     var stars = '';
//     for (var i = 0; i < testimonial.rating; i++) {
//       stars += '<i class="fas fa-star"></i>';
//     }

//     // Card content
//     card.innerHTML = `
//       <h3>${testimonial.name}</h3>
//       <p>${testimonial.message}</p>
//       <div class="stars">${stars}</div>
//     `;

//     testimonialsContainer.appendChild(card);
//   });
// }

// // Function to filter testimonials based on star rating
// function filterTestimonials(starRating) {
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", "https://api.npoint.io/456f10355d616c72db01", true);
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//       var data = JSON.parse(xhr.responseText);
//       if (starRating === 'all') {
//         displayTestimonials(data);
//       } else {
//         var filteredData = data.filter(function (testimonial) {
//           return testimonial.rating == starRating;
//         });
//         displayTestimonials(filteredData);
//       }
//     }
//   };
//   xhr.send();
// }


var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.npoint.io/456f10355d616c72db01", true);
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    var data = JSON.parse(xhr.responseText);
    displayTestimonials(data);
  }
};
xhr.send();

function displayTestimonials(testimonials) {
  var testimonialsContainer = document.getElementById('testimonials');
  testimonialsContainer.innerHTML = ''; // Clear existing content

  testimonials.forEach(function (testimonial) {
    var card = document.createElement('div');
    card.classList.add('testimonial');

    // Create stars
    var stars = '';
    for (var i = 0; i < testimonial.rating; i++) {
      stars += '<i class="fas fa-star"></i>';
    }

    // Handle undefined data
    var name = testimonial.name || 'Anonymous';
    var message = testimonial.message || 'No message provided.';
    var image = testimonial.image || 'https://via.placeholder.com/150'; // Default image if not provided

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
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.npoint.io/456f10355d616c72db01", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var data = JSON.parse(xhr.responseText);
      if (starRating === 'all') {
        displayTestimonials(data);
      } else {
        var filteredData = data.filter(function (testimonial) {
          return testimonial.rating == starRating;
        });
        displayTestimonials(filteredData);
      }
    }
  };
  xhr.send();
}
