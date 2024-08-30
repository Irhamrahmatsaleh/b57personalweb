document.getElementById('projectForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const projectName = document.getElementById('projectName').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const description = document.getElementById('description').value;
  const technologies = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
  const imageFile = document.getElementById('uploadImage').files[0];

  const reader = new FileReader();
  reader.readAsDataURL(imageFile);
  reader.onloadend = function () {
    const project = {
      id: Date.now(),
      projectName,
      startDate,
      endDate,
      duration: calculateDuration(startDate, endDate),
      description,
      technologies,
      imageSrc: reader.result
    };

    saveProjectToLocalStorage(project);
    renderProjectCard(project);
  };
});

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end - start;
  const days = diff / (1000 * 60 * 60 * 24);
  return `${Math.ceil(days)} days`;
}

function saveProjectToLocalStorage(project) {
  let projects = JSON.parse(localStorage.getItem('projects')) || [];
  projects.push(project);
  localStorage.setItem('projects', JSON.stringify(projects));
}

function renderProjectCard(project) {
  const cardContainer = document.getElementById('cardsContainer');
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-id', project.id);

  card.innerHTML = `
        <img src="${project.imageSrc}" alt="${project.projectName}">
        <h3>${project.projectName}</h3>
        <p>${project.duration}</p>
        <p>${project.description}</p>
        <div class="card-footer">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;

  cardContainer.appendChild(card);
  addCardEventListeners(card);
}

function addCardEventListeners(card) {
  card.querySelector('.delete').addEventListener('click', function () {
    const cardId = card.getAttribute('data-id');
    removeProjectFromLocalStorage(cardId);
    card.remove();
  });

  card.querySelector('.edit').addEventListener('click', function () {
    // Implementasi fitur edit
  });
}

function removeProjectFromLocalStorage(projectId) {
  let projects = JSON.parse(localStorage.getItem('projects'));
  projects = projects.filter(project => project.id !== Number(projectId));
  localStorage.setItem('projects', JSON.stringify(projects));
}

window.onload = function () {
  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  projects.forEach(project => renderProjectCard(project));
};
