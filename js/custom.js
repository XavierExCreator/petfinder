//https://api.petfinder.com/v2/{CATEGORY}/{ACTION}?{parameter_1}={value_1}&{parameter_2}={value_2}

const petForm = document.querySelector(".petForm");
const petResults = document.querySelector(".petResults");
const restartButton = document.querySelector(".restartButton");
restartButton.classList.add("hidden");

let usersPetChoice;
let userLocation;

petForm.addEventListener("submit", onFormSubmit);

function onFormSubmit(e) {
  restartButton.classList.add("hidden");
  e.preventDefault();
  const data = new FormData(petForm);
  const dataObject = Object.fromEntries(data.entries());
  usersPetChoice = dataObject.petOptions;
  userLocation = dataObject.location;
  petForm.reset();
  //calling the function below to get the token AFTER the form function gets the data and than telling the getToken function to pass the adoptablePets function
  getToken().then((token) => {
    getAdoptablePets(token);
  });
}

const apiKey = "87Vhz9gnj1Xwsxdl7a0RAK2I81sv9F3SdNfVEaEBDH57eaRmTy";
const apiSecret = "jeKgmT9n7OyN4rr5d0dnr798OsA8b7bUCdHuGfaF";

function getToken() {
  return fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "87Vhz9gnj1Xwsxdl7a0RAK2I81sv9F3SdNfVEaEBDH57eaRmTy",
      client_secret: "jeKgmT9n7OyN4rr5d0dnr798OsA8b7bUCdHuGfaF"
    })
  })
    .then((res) => res.json())
    .then((data) => data.access_token);
}

function getAdoptablePets(token) {
  //first need to call the getToken function, then once that value is returned, you can use the token in the API call
  //they will have to research how to build their link
  fetch(
    `//api.petfinder.com/v2/animals?type=${usersPetChoice}&location=${userLocation}`,
    {
      //note the token is being used in the header, which they will learn more about in backend
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayPets(data);
    });
}

function displayPets(data) {
  restartButton.classList.remove("hidden");
  petForm.classList.add("hidden");
  petResults.classList.remove("hidden");
  
 /*
 Added this line since I saw online this helps it from repeating because. although I'm hiding the data later on in the code, it isn't resetting/changing anything- only adding to it, which is why it was giving me the issue of the user seeing the previous results before the new results.
  */
petResults.innerHTML = "";
  for (let i = 0; i < data.animals.length; i++) {
    let animal = data.animals[i];
    let petColors = animal.colors.primary || `Color is not available.`;
    let petBreeds = animal.breeds.primary;
    let petNames = animal.name;
    let petDescr = animal.description || `Pet descripton is unavailable.`;

    let petDescription = document.createElement("p");
    let petColor = document.createElement("p");
    let petBreed = document.createElement("p");
    let petName = document.createElement("h2");

    petName.textContent = petNames;
    petBreed.textContent = `Breed: ` + petBreeds || `Breed unavailable.`;
    petColor.textContent = `Color: ` + petColors || `Color unavailable.`;
    petDescription.textContent = `Description: ` + petDescr || `Description unavailable.`;

    let petSection = document.createElement("div");
    petSection.classList.add("petSection");
    petResults.appendChild(petSection);

    for (let a = 0; a < animal.photos.length; a++) {
      let petImg = document.createElement("img");
      petImg.src = animal.photos[a].small || animal.photos[a].medium || animal.photos[a].large || animal.photos[a].full;
      petImg.alt = `Image of pet is unavailable`;
      petSection.appendChild(petImg);
    }

    petSection.appendChild(petName);
    petSection.appendChild(petBreed);
    petSection.appendChild(petColor);
    petSection.appendChild(petDescription);
  }
}

restartButton.addEventListener("click", redoForm);

function redoForm() {
  petResults.classList.add("hidden");
  petForm.classList.remove("hidden");
  restartButton.classList.add("hidden");
}
