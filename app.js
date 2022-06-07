const recipeForm = document.querySelector("#recipe-form");
const recipeContainer = document.querySelector("#recipe-container");
let listItems = [];

// FUNCTIONS
function handleFormSubmit(e) {
  e.preventDefault();
  const name = DOMPurify.sanitize(recipeForm.querySelector("#name").value);
  const alcohol = DOMPurify.sanitize(
    recipeForm.querySelector("#alcohol").value
  );
  const juice = DOMPurify.sanitize(recipeForm.querySelector("#juice").value);
  const ratio = DOMPurify.sanitize(recipeForm.querySelector("#ratio").value);
  const extras = DOMPurify.sanitize(recipeForm.querySelector("#extras").value);
  const notes = DOMPurify.sanitize(recipeForm.querySelector("#notes").value);
  const newRecipe = {
    name,
    alcohol,
    juice,
    ratio,
    extras,
    notes,
    id: Date.now(),
  };
  listItems.push(newRecipe);
  e.target.reset();
  recipeContainer.dispatchEvent(new CustomEvent("refreshRecipes"));
}

function displayRecipes() {
  const tempString = listItems
    .map(
      (item) => `
    <div class="col">
      <div class="card mb-4 rounded-5">
        <div class="card-header py-3 text-white bg-dark">
          <h4 class="my-0">${item.name}</h4>
        </div>
        <div class="card-body">
          <ul class="list-unstyled mt-3 mb-4 text-start">
            <li><strong>Alcohol: </strong>${item.alcohol}</li>
            <li><strong>Juice: </strong>${item.juice}</li>
            <li><strong>Ratio Size: </strong>${item.ratio}</li>
            <li><strong>Extras: </strong>${item.extras}</li>
            ${
              item.notes && item.notes.length
                ? `<li><strong>Notes: </strong>${item.notes}</li>`
                : ""
            }
          </ul>
          <button class="btn btn-sm btn-outline-danger" aria-label="Delete ${
            item.name
          }" value="${item.id}">Delete Recipe</button>
          
        </div>
      </div>
    </div>
    `
    )
    .join("");
  recipeContainer.innerHTML = tempString;
}

function mirrorStateToLocalStorage() {
  localStorage.setItem("recipeContainer.list", JSON.stringify(listItems));
}

function loadinitialUI() {
  const tempLocalStorage = localStorage.getItem("recipeContainer.list");
  if (tempLocalStorage === null || tempLocalStorage === []) return;
  const tempRecipes = JSON.parse(tempLocalStorage);
  listItems.push(...tempRecipes);
  recipeContainer.dispatchEvent(new CustomEvent("refreshRecipes"));
}

function deleteRecipeFromList(id) {
  listItems = listItems.filter((item) => item.id !== id);
  recipeContainer.dispatchEvent(new CustomEvent("refreshRecipes"));
}

recipeForm.addEventListener("submit", handleFormSubmit);
recipeContainer.addEventListener("refreshRecipes", displayRecipes);
recipeContainer.addEventListener("refreshRecipes", mirrorStateToLocalStorage);
window.addEventListener("DOMContentLoaded", loadinitialUI);
recipeContainer.addEventListener("click", (e) => {
  if (e.target.matches(".btn-outline-danger")) {
    deleteRecipeFromList(Number(e.target.value));
  }
  
});
