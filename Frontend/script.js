import { hej, flush, printCategories, getRecipesByCategory, printSavedRecipe } from './modules/functions.mjs';

let savedRecipeBtn = document.getElementById("savedRecipeBtn");
let randomRecipeBtn = document.getElementById("randomRecipeBtn");
let homeBtn = document.getElementById("homeBtn");
let recipeCategoryField2 = document.getElementById("recipeCategoryField2");

hej();

savedRecipeBtn.addEventListener("click", function () {
    console.log("Printar ut sparade recept");
    printSavedRecipe ();
})

randomRecipeBtn.addEventListener("click", function () {
    console.log("Nu kommer random recept att visas!");
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
        flush();

        console.log(data);
        const recipe = data.meals[0];

        let title = document.createElement("h3");
        title.innerText = `Recept: ${recipe.strMeal}`;

        let image = document.createElement("img");
        image.src = recipe.strMealThumb;
        image.style.width ="400px";

        let ingrediens = document.createElement("h4")
        ingrediens.innerText = "Ingredienser:"
        let ingrediensList = document.createElement("ul");

        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`] && recipe[`strMeasure${i}`]) {
                let ingredientItem = document.createElement("li");
                ingredientItem.innerText = `${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`;
                ingrediensList.appendChild(ingredientItem);
            } else {
                break;
            }
        }

        let saveBtn = document.createElement("button")
        saveBtn.innerText = "Spara recept";
        saveBtn.style.width = "400px";

        saveBtn.addEventListener("click", function () {
            console.log("Spara recept: " + recipe.idMeal);
            const saveRecipeToDb = {
                externalId: recipe.idMeal,
                comment: "Notis"
            };
        fetch("http://localhost:8080/save", {
            method: 'POST',
            headers: {
                'content-Type': 'application/json',
            },
            body: JSON.stringify(saveRecipeToDb)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Receptet har sparats i din databas", saveRecipeToDb);
        })

        })
        
        recipeCategoryField2.appendChild(title);   
        recipeCategoryField2.appendChild(image);
        recipeCategoryField2.appendChild(saveBtn);
        recipeCategoryField2.appendChild(ingrediens);
        recipeCategoryField2.appendChild(ingrediensList);
   
        
    })
})

homeBtn.addEventListener("click", () => {
    console.log("hem");
    printCategories();
})


printCategories();



