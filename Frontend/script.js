console.log("Hej från JS");
let savedRecipe = document.getElementById("savedRecipeBtn");
let randomRecipe = document.getElementById("randomRecipeBtn");
let randomRecipeField = document.getElementById("randomRecipeField");
let recipeList = document.getElementById("recipeList");

savedRecipe.addEventListener("click", function () {
    fetch("http://localhost:8080/all")
    .then(res => res.json())
    .then(data => {
        
        recipeList.innerHTML = "";
        randomRecipeField.innerHTML = "";
        data.forEach(recipe => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${recipe.id}</strong><p>Kommentar: ${recipe.comment}</p>`

            const textfield = document.createElement("textarea");
            textfield.value = recipe.comment;

            const editBtn = document.createElement("button");
            editBtn.innerText = "Spara ändring"

            editBtn.addEventListener("click", () => {
                const newComment = textfield.value;

                fetch(`http://localhost:8080/${recipe.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ comment: newComment }),
                })
                .then(response => response.json())
                .then(updatedRecipe => {
                    li.querySelector('p').innerText = `Kommentar: ${updatedRecipe.comment}`;
                })
            })

            recipeList.appendChild(li);
            recipeList.appendChild(textfield);
            recipeList.appendChild(editBtn);
        });
    })
    })
randomRecipe.addEventListener("click", function () {
    console.log("Nu kommer random recept att visas!");
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
        recipeList.innerHTML= "";
        randomRecipeField.innerHTML = "";
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
        
        for (let i = 1; i <= 40; i++) {
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
        
        randomRecipeField.appendChild(title);
        randomRecipeField.appendChild(image);
        randomRecipeField.appendChild(saveBtn);
        randomRecipeField.appendChild(ingrediens);
        randomRecipeField.appendChild(ingrediensList);
        
    })
})
 