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
          <button onclick="window.location.href='blogDetail.html?id=${blog.id}'">View</button>
          <button onclick="editBlog(${blog.id})">Edit</button>
          <button
                  id="deleteButton"
                  style="background: #bb2124; color: white; cursor: pointer;"
                  onclick="deleteBlog(${blog.id})"
                  onmouseover="this.style.background='#6e1404'"
                  onmouseout="this.style.background='#bb2124'">Delete</button>
        </div>
      </div>
    `;

    contents.appendChild(blogItem);
  });
}

function editBlog(id) {
  const blog = blogs.find(blog => blog.id === id);
  if (blog) {
    document.getElementById("input-blog-id").value = blog.id;
    document.getElementById("input-blog-title").value = blog.title;
    document.getElementById("input-blog-content").value = blog.content;
    // Check the corresponding categories
    document.querySelectorAll("#blog-category input[type='checkbox']").forEach(cb => {
      cb.checked = blog.categories.includes(cb.value);
    });
    document.getElementById("form-title").innerText = "Edit Post Blog";
    window.scrollTo(0, 0); // Scroll to top for better UX
  }
}

function deleteBlog(id) {
  const blogIndex = blogs.findIndex(blog => blog.id === id);
  if (blogIndex !== -1) {
    blogs.splice(blogIndex, 1);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    renderBlog(); // Re-render the blog list without the deleted item
  }
}

renderBlog();
