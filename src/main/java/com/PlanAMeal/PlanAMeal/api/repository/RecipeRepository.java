package com.PlanAMeal.PlanAMeal.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PlanAMeal.PlanAMeal.api.model.Recipe;

public interface RecipeRepository extends JpaRepository <Recipe, Integer>{

    
} 
    
