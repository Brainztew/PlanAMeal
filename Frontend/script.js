console.log("Hej från JS");
fetch("http://localhost:8080/all")
.then(res => res.json())
.then(data => {
    const recipeToList = document.getElementById("recipeList");

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

        recipeToList.appendChild(li);
        recipeToList.appendChild(textfield);
        recipeToList.appendChild(editBtn);
    });
})

