
let randomRecipeField = document.getElementById("randomRecipeField");
let recipeList = document.getElementById("recipeList");
let recipeCategoryField = document.getElementById("recipeCategoryField");
let recipeCategoryField2 = document.getElementById("recipeCategoryField2");

export function hej() {
    console.log("Hej från module!");
};

export function printCategories() {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(res => res.json())
    .then(data => {
        flush();
        console.log(data);

        data.categories.forEach(category => {
            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add("categoryItem")

            const img = document.createElement("img");
            img.src = category.strCategoryThumb;
            categoryDiv.appendChild(img);

            img.addEventListener("click", () => {
                console.log("klick på bild " + category.strCategory);
                getRecipesByCategory(category.strCategory)
            })

            const p = document.createElement("p");
            p.innerText = category.strCategory;
            categoryDiv.appendChild(p);
                     
            randomRecipeField.appendChild(categoryDiv);
        })
    })
};

export function flush() {
    recipeList.innerHTML= "";
    randomRecipeField.innerHTML = "";
    recipeCategoryField.innerHTML = "";
    recipeCategoryField2.innerHTML = "";
};

export function getRecipesByCategory(categoryId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryId}`)
        .then(res =>  res.json())
        .then(data => {

            flush();

            console.log("Från API", data);
            for (let i = 0; i < 20; i++) {
                const recipe = data.meals[i];
                
                const recipeContainer = document.createElement("div");
                recipeContainer.classList.add("mealsInCategory")

                const p = document.createElement("p");
                p.innerText = recipe.strMeal;
                recipeContainer.appendChild(p); 

                const img = document.createElement("img");
                img.src = recipe.strMealThumb;
                img.style.width = "200px";
                recipeContainer.appendChild(img);

                const saveBtn = document.createElement("button");
                saveBtn.innerText = "Spara recept";
                recipeContainer.appendChild(saveBtn);

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

                  recipeCategoryField.appendChild(recipeContainer);
                }
            } 
        )
        .catch(error => console.error("Error fetching recipes by category:", error));
};

export function printSavedRecipe () {
    fetch("http://localhost:8080/all")
    .then(res => res.json())
    .then(data => {
        flush();

        data.forEach(recipe => {
            const li = document.createElement("li");
            li.innerText = recipe.externalId;

            let title, image, textfield, editBtn, moreInfoBtn, deleteRecipeBtn; 

            fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + recipe.externalId)
            .then(res => res.json())
            .then(externalData => {
        
                title = document.createElement("h3");
                title.innerText = externalData.meals[0].strMeal;
                title.style.backgroundColor ="rgb(100, 11, 11)";

                image = document.createElement("img");
                image.src = externalData.meals[0].strMealThumb;
                image.style.width = "100px";

                textfield = document.createElement("textarea");
                textfield.value = recipe.comment;
                textfield.style.height = "100px";
                textfield.style.width = "200px";

                editBtn = document.createElement("button");
                editBtn.innerText = "Spara notis";

                moreInfoBtn = document.createElement("button");
                moreInfoBtn.innerText = "visa recept";

                deleteRecipeBtn = document.createElement("button");
                deleteRecipeBtn.innerText = "Ta bort recept";

                editBtn.addEventListener("click", () => {
                    const newComment = textfield.value;
                    console.log("Ändrar notis");
                    fetch(`http://localhost:8080/${recipe.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ comment: newComment }),
                    })
                    .then(response => response.json())
                    .then(updatedRecipe => {
                        li.querySelector.innerText = updatedRecipe.comment;
                    })
                });

                deleteRecipeBtn.addEventListener("click", () => {
                    console.log("Ta bort recept");
                    fetch(`http://localhost:8080/${recipe.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(res =>{
                        li.remove();
                        printSavedRecipe();
                    })
                });

                moreInfoBtn.addEventListener("click", () => {
                    let recipeInstructions = li.querySelector("p");
                    let ingredientsList;
                
                    if (!recipeInstructions) {
                        console.log("Printar instruktioner");
                        recipeInstructions = document.createElement("p");
                        li.appendChild(recipeInstructions);
                
                        ingredientsList = document.createElement("ul");
                
                        for (let i = 1; i <= 20; i++) {
                            let ingredient = externalData.meals[0][`strIngredient${i}`];
                            let measure = externalData.meals[0][`strMeasure${i}`];
                
                            if (ingredient && measure) {
                                let ingredientItem = document.createElement("li");
                                ingredientItem.innerText = `${ingredient} - ${measure}`;
                                ingredientsList.appendChild(ingredientItem);
                            } else {
                                break;
                            }
                        }
                
                        li.appendChild(ingredientsList);
                        ingredientsList.style.display = 'none';
                        recipeInstructions.style.display = 'none';
                    } 
                        
                    recipeInstructions.innerText = externalData.meals[0].strInstructions;
                    ingredientsList = li.querySelector("ul");

                    ingredientsList.style.display = (ingredientsList.style.display === 'none') ? 'block' : 'none';
                    recipeInstructions.style.display = (recipeInstructions.style.display === 'none') ? 'block' : 'none';
                    
                });
                
                
                recipeList.appendChild(title);
                recipeList.appendChild(li);
                recipeList.appendChild(image);
                recipeList.appendChild(textfield);
                recipeList.appendChild(editBtn);
                recipeList.appendChild(moreInfoBtn);
                recipeList.appendChild(deleteRecipeBtn);
            });
        });
    });
};

