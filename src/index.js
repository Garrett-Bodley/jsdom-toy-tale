let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  loadToys();
  createNewToy();
});



function loadToys(){
  fetch('http://localhost:3000/toys').then(resp => resp.json()).then(info => {
    for (const toy of info) {
      createCard(toy);
    };
  });
};



function createCard(toy){

  let card = document.createElement('div');
  card.className = 'card';
  card.id = toy.id;

  let elements = []

  let cardName = document.createElement('h2');
  cardName.innerText = toy.name
  cardName.id = toy.name + '-name'
  elements.push(cardName);

  let cardImg = document.createElement('img');
  cardImg.src = toy.image;
  cardImg.className = 'toy-avatar';
  cardImg.id = toy.name + '-image'
  elements.push(cardImg);

  let likes = document.createElement('p');
  likes.innerHTML = `${toy.likes} Likes`;
  likes.id = toy.name + '-likes'
  elements.push(likes);

  let likeButton = document.createElement('button');
  likeButton.class = 'like-btn';
  likeButton.innerHTML = 'Like <3'
  likeButton.id = toy.name + '-like-button'
  likeButton.addEventListener('click', function(){
    likeToy(toy)
  })
  elements.push(likeButton);

  for (const element of elements){
    card.appendChild(element);
  };

  document.getElementById('toy-collection').appendChild(card);
};



function likeToy(toy){
  const submitUrl = `http://localhost:3000/toys/${toy.id}`

  let formData = {
    name: toy.name,
    image: toy.image,
    likes: ++toy.likes
  };

  let configObj = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },

    body: JSON.stringify(formData)
  };

  return fetch(submitUrl, configObj).then(resp => resp.json()).then(json => rerenderCardLikes(json));
};



function rerenderCardLikes(json){
  let likes = document.getElementById(json.name + '-likes');
  likes.innerHTML = json.likes + ' Likes';
};



function createNewToy(){
  let form = document.querySelector("body > div.container > form")
  form.addEventListener('submit', function(e){
    e.preventDefault();
    let nameInput = document.querySelector("body > div.container > form > input:nth-child(2)").value;
    let imgInput = document.querySelector("body > div.container > form > input:nth-child(4)").value;

    postToy(nameInput, imgInput);
    form.reset();
  })
};



function postToy(nameInput, imageInput){
  const submitUrl = 'http://localhost:3000/toys'

  let formData = {
    name: nameInput,
    image: imageInput,
    likes: 0
  };

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },

    body: JSON.stringify(formData)
  };

  return fetch(submitUrl, configObj).then(resp => resp.json()).then(json => {
    createCard(json)
  });
};