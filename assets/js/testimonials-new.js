const testimonials = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL5m2gr2lMb1huhMFwIR41jrDU5ZOxKydgEw&s",
    content: "Dattebayo",
    author: "Naruto",
    rating: 5,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFo9nKGI6eDtfB7wVLiJ0voKBJJb5nrJj9Wg&s",
    content: "Tch",
    author: "Sasuke",
    rating: 1,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0MBAh1_8sj6rA6QhH31iBkhG2v7rLce4OSQ&s",
    content: "Beban",
    author: "Sakura",
    rating: 3,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0MBAh1_8sj6rA6QhH31iBkhG2v7rLce4OSQ&s",
    content: "Beban",
    author: "Sakura",
    rating: 3,
  },
];

function generateTestimonialsHTML(testimonialsArray) {
  return testimonialsArray.map((testimonial) => {
    return `<div class="testimonial">
      <img src="${testimonial.image}" class="profile-testimonial" />
      <p class="quote">"${testimonial.content}"</p>
      <p class="author">- ${testimonial.author}</p>
      <p class="author">${testimonial.rating} <i class="fa-solid fa-star"></i></p>
    </div>`;
  }).join('');
}

function displayTestimonials(filterCallback) {
  const filteredTestimonials = filterCallback ? testimonials.filter(filterCallback) : testimonials;
  const testimonialsHTML = generateTestimonialsHTML(filteredTestimonials);
  document.getElementById("testimonials").innerHTML = testimonialsHTML;
}

function filterTestimonials(rating) {
  if (rating === 'all') {
    displayTestimonials();
  } else {
    displayTestimonials((testimonial) => testimonial.rating === rating);
  }
}

// Inisialisasi semua testimonial saat halaman dimuat
displayTestimonials();
