const nav = document.getElementById('main');
const navbar = nav.querySelector('.navitems');
const siteWrap = document.querySelector('.site-wrap');

// fix the navigation to the top of the page

let topOfNav = nav.offsetTop;

function fixNav() {
  if(window.scrollY >= topOfNav) {
    document.body.style.paddingTop = nav.offsetHeight + 'px';
    document.body.classList.add('fixed-nav');
  } else {
    document.body.classList.remove('fixed-nav');
    document.body.style.paddingTop = 0;
  }
}

// Show and hide the navigation

const logo = document.querySelector('.logo')

logo.addEventListener('click', showMenu);

function showMenu(e) {
  document.body.classList.toggle('show');
  const navLinks = document.querySelectorAll('.navitems a');
  navLinks.forEach(link => link.addEventListener('click', dump))
  e.preventDefault();
}

function dump(){
  document.body.classList.toggle('show');
}



function deleteme(thingtodelete) {
  fetch(`http://localhost:3001/api/recipes/${thingtodelete}`, {
    method: 'delete'
  })
  .then(location.href = '/')
}


function choosePageRendering(){
  console.log('choosePage hash is ' + window.location.hash)
  if(window.location.hash === '#recipes'){
    fetchLab()
  } else {
    showDetailPage()
  }
}

function fetchLab() {

  console.log('fetchLab hash is ' + window.location.hash || null)

  fetch('http://localhost:3001/api/recipes')
  .then( res => res.json() )
  .then( data => {
    const markup =
    `<ul>
    ${data.map(
      recipe => `<li><a href="#recipe/${recipe._id}">${recipe.title}</a></li>`
    ).join('')}
    </ul>`;
    navbar.innerHTML = markup;
  
    let output = '';
  
    data.forEach((recipe) => {
      output += `
        <div class="recipe-preview">
        <h2><a href="#recipe/${recipe._id}">${recipe.title}</a></h2>
        <img src="/img/recipes/${recipe.image}" />
        <p>${recipe.description}</p>
        <span onclick="deleteme('${recipe._id}')">✖︎</span>
        </div>
      `
    })
  
    siteWrap.innerHTML = output;
  
  })
}

function showDetailPage(){

  console.log('showDetailPage hash is ' + window.location.hash)

  let navLinkId = window.location.hash.substring(8);

  fetch(`http://localhost:3001/api/recipes/${navLinkId}`, {
    method: 'get'
  }).then(response => response.json())
  .then( data => {
    
    let recipeContent = `
    <div class="recipe-preview">
    <h2>Recipe for ${data.title}</h2>
    <img src="/img/recipes/${data.image}" />
    <h2>Ingredients</h2>
    <ul>
    <li>${data.ingredients[0]}</li>
    <li>${data.ingredients[1]}</li>
    <li>${data.ingredients[2]}</li>
  </ul>
  <h2>Instructions</h2>
    <ul>
      <li>${data.preparation[0].step}</li>
      <li>${data.preparation[1].step}</li>
      <li>${data.preparation[2].step}</li>
    </ul>
    </div>
  `
  siteWrap.innerHTML = recipeContent;
  })
}


//  fetchLab();

if (!location.hash) {
  location.hash = '#recipes';
}
window.addEventListener('hashchange', choosePageRendering);
window.addEventListener('scroll', fixNav);

