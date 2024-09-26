
async function loadProjects(userName) {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const projects = await response.json();

    const projectContainer = document.querySelector('.project-section .row');
    projectContainer.innerHTML = '';

    projects.forEach((project) => {
      const card = document.createElement('div');
      card.classList.add('card', 'col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'm-2', 'p-0', 'shadow-sm');

      const shortDescription = project.description.length > 100
        ? project.description.substring(0, 100) + '...'
        : project.description;

      card.innerHTML = `
        <img src="${project.imageUrl}" class="card-img-top" alt="Project Image">
        <div class="card-body shadow">
            <h2 class="card-title h5">${project.projectName} </h2>
            <p class="card-text">${new Date(project.startDate).getFullYear()}</p>
          <p class="card-text">Duration: ${getProjectDuration(project.startDate, project.endDate)}</p>
          <p class="card-text">${shortDescription}</p> <!-- Tampilkan deskripsi pendek -->
          <p class="card-text"><strong>Author: </strong>${project.authorName}</p>
          <div class="icons mb-3">
            ${project.technologies.map(tech => `<i class="fab fa-${tech.toLowerCase()} mx-1"></i>`).join('')}
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <!-- Ikon tambahan -->
            <div style="font-size: 20px;">
              <i class="fab fa-google-play mx-2" style="color: green;"></i> <!-- Play Store Icon -->
              <i class="fab fa-android mx-2" style="color: lime;"></i> <!-- Android Icon -->
              <i class="fab fa-java mx-2" style="color: orange;"></i> <!-- Java Icon -->
            </div>
            <!-- Tombol Edit dan Delete -->
            <div>
            ${project.authorName === userName ? `
                <button class="btn btn-warning edit btn-sm" data-id="${project.id}">Edit</button>
                <button class="btn btn-danger delete btn-sm" data-id="${project.id}">Delete</button>
              ` : ''
        }
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', function (e) {
        if (!e.target.classList.contains('edit') && !e.target.classList.contains('delete')) {
          window.location.href = `project-detail?id=${project.id}`;
        }
      });

      projectContainer.appendChild(card);
    });
    //-------------------------------------------
    // Fungsi untuk menghapus project
    async function deleteProject(projectId) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        });

        if (response.status === 204) {
          alert('Project deleted successfully');
          window.location.reload();
        } else {
          const errorMessage = await response.text();
          alert(`Failed to delete project: ${errorMessage}`);
          // alert(`Anda tidak bisa menghapus proyek orang lain`)
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('An error occurred while deleting the project.');
      }
    }

    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        const projectId = this.dataset.id;

        const isConfirmed = window.confirm("Are you sure you want to delete this project?");
        if (isConfirmed) {
          deleteProject(projectId);
        }
      });
    });



    //---------------------------------------------
    // Event listener untuk tombol Edit
    document.querySelectorAll('.edit').forEach(button => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        const projectId = this.dataset.id;
        editProject(projectId);
      });
    });

  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Fungsi untuk menghitung durasi proyek
function getProjectDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)); // Durasi dalam bulan
  return `${duration} months`;
}

//---------------------------------
// Fungsi untuk menghapus proyek
async function deleteProject(projectId) {
  try {
    // Kirim permintaan DELETE ke server
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Refresh tampilan proyek setelah berhasil dihapus
    loadProjects();
  } catch (error) {
    console.error('Error deleting project:', error);
  }
}
//-----------------

// Fungsi untuk mengedit proyek
function editProject(projectId) {
  window.location.href = `update-my-project?editId=${projectId}`;
}


//---------------------------------
// Fungsi untuk mengambil username
async function getUsername() {
  try {
    // Kirim permintaan DELETE ke server
    const response = await fetch(`/getUsername`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }


    const userName = await response.json();
    loadProjects(userName['userName']);
  } catch (error) {
    console.error('Error deleting project:', error);
  }
}
//-----------------

// Load projects on page load
document.addEventListener('DOMContentLoaded', () => {
  getUsername(); // Ganti sesuai user yang sedang login

});
