const poke = document.getElementById("poke");
const searchBar = document.getElementById("searchBar");
let myDropdown = document.getElementById("myDropdown");
let pokemon = [];
let data = [];
let p = [];
const cachedPokemon = {};

//to show dropdown box
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

//for search bar
searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();

  const filteredpokemons = pokemon.filter(
    (x) =>
      x.name.toString().toLowerCase().includes(searchString) ||
      x.height.toString().toLowerCase().includes(searchString)
  );
  displaydata(filteredpokemons);
});

//filters the heights
function HeightFilters() {
  const filtered = pokemon.filter((pheight) => pheight.height > "10");
  displaydata(filtered);
}

//filters the weights
function WeightFilters() {
  const filtered = pokemon.filter((pweight) => pweight.weight > "500");
  displaydata(filtered);
}

//filters the order
function OrderFilters() {
  const filtered = pokemon.filter((porder) => porder.order > "10");
  displaydata(filtered);
}

//filters the base experience
function experienceFilters() {
  const filtered = pokemon.filter((pexp) => pexp.base_experience > "100");
  displaydata(filtered);
}
//to go to previous page and reload
function goBack() {
  history.go(-1);
  location.reload();
}

//to fetch data from api
const getdata = async () => {
  $("div.spanner").addClass("show");
  $("div.overlay").addClass("show");
  for (i = 1; i < 70; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const res = await fetch(url);
    data = await res.json();
    p[i - 1] = data;
  }
  console.log(p);
  pokemon = p.map((data, index) => ({
    name: data.name,
    height: data.height,
    weight: data.weight,
    base_experience: data.base_experience,
    id: index + 1,
    type: data.types.map((type) => type.type.name).join(", "),
    ability: data.abilities.map((ability) => ability.ability.name).join(", "),
    image_front: data.sprites["front_default"],
    image_back: data.sprites["back_default"],
    move: data.moves.map((move) => move.move.name).join(", "),
  }));
  console.log(pokemon);
  setTimeout(() => {
    $("div.spanner").removeClass("show");
    $("div.overlay").removeClass("show");
  }, 500);
  console.log(data);
  displaydata(pokemon);
};

//to display data on screen
const displaydata = (pokemon) => {
  const pokemonHTMLString = pokemon
    .map(
      (displaypokemon) =>
        `
    <li class="card" onclick="selectPokemon(${displaypokemon.id})">
        <img class="card-image" src="${displaypokemon.image_front}"/>
        <h2 class="card-title"> ${displaypokemon.name}</h2>
        <h5> Type: ${displaypokemon.type}</h5>
        <h5> Height: ${displaypokemon.height}</h5>
        <h5> Weight:${displaypokemon.weight}</h5>
        </a>
    </li>
        `
    )
    .join("");
  poke.innerHTML = pokemonHTMLString;
};
getdata();

//to fetch data of the pokemon selected
const selectPokemon = async (id) => {
  if (!cachedPokemon[id]) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const displaypokemon = await res.json();
    cachedPokemon[id] = displaypokemon;
    console.log(cachedPokemon[id]);
    displayPopup(displaypokemon);
  } else {
    displayPopup(cachedPokemon[id]);
  }
};

//to display the data of selected pokemon
const displayPopup = (displaypokemon) => {
  const type = displaypokemon.types.map((type) => type.type.name).join(",  ");
  const ability = displaypokemon.abilities
    .map((ability) => ability.ability.name)
    .join(", ");
  const move = displaypokemon.moves.map((move) => move.move.name).join(",  ");
  const htmlString = `
        <div class="popup">
            <button id="closeBtn" onclick="closePopup()">X</button>
            <div class="card">
                <img class="card-image" src="${displaypokemon.sprites["front_default"]}"/>
                <img class="card-image" src="${displaypokemon.sprites["back_default"]}"/>
                <h3 class="card-title">${displaypokemon.name}</h3>
                <h4 class="card-subtitle">Type: ${type} <br> Height: ${displaypokemon.height}  
                 <br> Weight: ${displaypokemon.weight}
                 <br> order: ${displaypokemon.order}
                 <br> base_experience: ${displaypokemon.base_experience}
                 <br> ability: ${ability}
                 <br> move: ${move}
                 </h4>
            </div>
        </div>
    `;
  poke.innerHTML = htmlString + poke.innerHTML;
};

//to close the pop-up window
const closePopup = () => {
  const popup = document.querySelector(".popup");
  popup.parentElement.removeChild(popup);
};
