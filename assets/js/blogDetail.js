document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get('id');

  if (blogId) {
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const blog = blogs.find(blog => blog.id === parseInt(blogId));

    if (blog) {
      document.getElementById("blog-detail-container").innerHTML = `
        <div class="blog-detail-content">
          ${blog.image ? `<div class="blog-image"><img src="${blog.image}" alt="${blog.title}"></div>` : ""}
          <h1>${blog.title}</h1>
          <p>${blog.content}</p>
          <p><strong>Categories:</strong> ${blog.categories}</p>
          <p><strong>Posted on:</strong> ${blog.createdAt}</p>
        </div>
      `;
    } else {
      document.getElementById("blog-detail-container").innerHTML = "<p>Blog not found.</p>";
    }
  } else {
    document.getElementById("blog-detail-container").innerHTML = "<p>No blog ID specified.</p>";
  }

  // Set the current date and year in the footer
  // document.getElementById("current-date").innerText = new Date().toLocaleDateString();
  document.getElementById("current-year").innerText = new Date().getFullYear();
});
