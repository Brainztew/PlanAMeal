package com.PlanAMeal.PlanAMeal.api.controller;

import java.util.List;
import java.util.Map;
import com.PlanAMeal.PlanAMeal.api.model.Recipe;
import com.PlanAMeal.PlanAMeal.api.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @GetMapping("/all")
    public List<Recipe> getAllRecipes() {
        System.out.println("Skriv ut all recept från DB");
        return recipeRepository.findAll();
    }

    @PostMapping("/save")
    public Recipe newRecipe(@RequestBody Recipe recipe) {
        List<Recipe> existingRecipes = recipeRepository.findAll();
        for (Recipe existingRecipe : existingRecipes) {
            if(existingRecipe.getExternalId() == (recipe.getExternalId())) {
                System.out.println("Finns redan i din DB");
                return null;
            } 
        }
    System.out.println("Spara " + recipe.getExternalId());
    return recipeRepository.save(recipe); 
    } 

    @DeleteMapping("/{id}")
    public void removeRecipe(@PathVariable int id) {
        System.out.println("Raderar " + id);
        recipeRepository.deleteById(id);
    }

    @PatchMapping("/{id}")
    public Recipe editComment(@PathVariable int id, @RequestBody Map<String, String> request) {
        System.out.println("Patch " + id + request);

        Recipe existingRecipe = recipeRepository.findById(id).orElse(null);

        if (existingRecipe != null) {
            String newComment = request.get("comment");
            existingRecipe.setComment(newComment);
            return recipeRepository.save(existingRecipe);
        } else {
            return null;
        }
    }
}
