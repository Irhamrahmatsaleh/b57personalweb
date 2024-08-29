const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

function addOrUpdateBlog(event) {
  event.preventDefault();

  const blogId = document.getElementById("input-blog-id").value;
  const inputTitle = document.getElementById("input-blog-title").value;
  const inputContent = document.getElementById("input-blog-content").value;
  const inputImage = document.getElementById("input-blog-image").files;
  const categories = Array.from(document.querySelectorAll("#blog-category input[type='checkbox']:checked")).map(cb => cb.value);

  if (!inputTitle || !inputContent || !categories.length) {
    alert("Please fill out all fields.");
    return;
  }

  let imageURL = "";
  if (inputImage.length) {
    imageURL = URL.createObjectURL(inputImage[0]);
  }

  if (blogId) {
    // Update existing blog
    const blogIndex = blogs.findIndex(blog => blog.id === parseInt(blogId));
    if (blogIndex !== -1) {
      blogs[blogIndex].title = inputTitle;
      blogs[blogIndex].content = inputContent;
      blogs[blogIndex].image = imageURL || blogs[blogIndex].image;
      blogs[blogIndex].categories = categories.join(", ");
    }
  } else {
    // Create new blog
    const newBlog = {
      id: new Date().getTime(),
      title: inputTitle,
      content: inputContent,
      image: imageURL,
      categories: categories.join(", "),
      createdAt: new Date().toLocaleString()
    };
    blogs.unshift(newBlog);
  }

  localStorage.setItem("blogs", JSON.stringify(blogs));
  renderBlog();
  console.log(blogs)
  event.target.reset();
}

function renderBlog() {
  const contents = document.getElementById("contents");
  contents.innerHTML = "";

  blogs.forEach((blog) => {
    const blogItem = document.createElement("div");
    blogItem.className = "blog-list-item";

    const blogImage = blog.image ? `<div class="blog-image"><img src="${blog.image}" alt="${blog.title}"></div>` : "";

    blogItem.innerHTML = `
      ${blogImage}
      <div class="blog-content">
        <h3>${blog.title}</h3>
        <p>${blog.content.substring(0, 100)}...</p>
        <p><strong>Categories:</strong> ${blog.categories}</p>
        <p><strong>Posted on:</strong> ${blog.createdAt}</p>
        <div class="btn-group">
          <button onclick="editBlog(${blog.id})">Edit</button>
          <!--<button style="background: #bb2124;" onclick="deleteBlog(${blog.id})">Delete</button>-->
          <button
                  id="deleteButton"
                  style="background: #bb2124; color: white; cursor: pointer;"
                  onclick="deleteBlog(${blog.id})"
                  onmouseover="this.style.background='#df266f'"
                  onmouseout="this.style.background='#bb2124'">Delete</button>
        </div>
      </div>
    `;

    contents.appendChild(blogItem);
  });
}

renderBlog();
