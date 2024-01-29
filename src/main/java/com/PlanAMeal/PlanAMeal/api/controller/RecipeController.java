package com.PlanAMeal.PlanAMeal.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.PlanAMeal.PlanAMeal.api.model.Recipe;
import com.PlanAMeal.PlanAMeal.api.repository.RecipeRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @GetMapping("/all")
    public List<Recipe> getAllRecipes() {
        System.out.println("Skriv ut all recept");
        return recipeRepository.findAll();
    }

    @PostMapping("/save")
    public Recipe newRecipe(@RequestBody Recipe recipe) {
        System.out.println("Spara" + recipe);
        return recipeRepository.save(recipe);
    }

    @DeleteMapping("/{id}")
    public void removeRecipe(@PathVariable int id) {
        System.out.println("Raderar " + id);
        recipeRepository.deleteById(id);
    }
    
    
}
