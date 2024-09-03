class Testimonial {
  image = "";
  content = "";
  author = "";
  rating = "";

  constructor(image, content, author, rating) {
    this.image = image;
    this.content = content;
    this.author = author;
    this.rating = rating;
  }
  getHTML() {
    return `<div class="testimonial">
            <img src="${this.image}" class="profile-testimonial" />
            <p class="quote">"${this.content}"</p>
            <p class="author">- ${this.author}</p>
            <p class="rating">${this.rating}</p>
        </div>`;
  }
}

const testimonial1 = new Testimonial(
  "https://media.istockphoto.com/id/805011368/id/foto/potret-pria-dewasa-tengah-yang-serius.jpg?s=1024x1024&w=is&k=20&c=8I1Xhdfb6Jp8i-9b50XJpcRfYKe5eIjhT0GohoeXy3M=",
  "ceo corporate1",
  "Jhon doe",
  2
);

const testimonial2 = new Testimonial(
  "https://media.istockphoto.com/id/805011890/id/foto/potret-pria-muda-tampan-afrika-tersenyum.jpg?s=1024x1024&w=is&k=20&c=PCIo2yvRnCACsALuQpeV1SElh4iUZaYDeOjNhjjcJEg=",
  "cto corporate2",
  "Bruno",
  4
);

const testimonial3 = new Testimonial(
  "https://media.istockphoto.com/id/1194465593/id/foto/wanita-muda-jepang-tampak-percaya-diri.jpg?s=1024x1024&w=is&k=20&c=mNT_QwbfrEy3XY2CChd3IOAGnQ5YQGujNKMtKYPm5jw=",
  "employe",
  "Sakura",
  5
);

const testimonials = [testimonial1, testimonial2, testimonial3];
let testimonialHTML = ``;

for (let i = 0; i < testimonials.length; i++) {
  testimonialHTML += testimonials[i].getHTML();
}

document.getElementById("testimonials").innerHTML = testimonialHTML;
