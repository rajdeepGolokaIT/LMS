package com.sas.SalesAnalysisSystem.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sas.SalesAnalysisSystem.exception.CustomErrorResponse;
import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Category;
import com.sas.SalesAnalysisSystem.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
	
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<Object> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok().body(categories);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No categories found");
        }
    }

    @GetMapping("/{id}") 
    public ResponseEntity<Object> getCategoryById(@PathVariable("id") Long id) {
        try {
            Category category = categoryService.getCategoryById(id);
            return ResponseEntity.ok().body(category);
        } catch (ResourceNotFoundException e) {
        	CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No categories Found for this id - "+ id);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/categories/all/" + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }


    @PostMapping("/add-category")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }
    
    @PutMapping("update-category/{id}")
    public ResponseEntity<Object> updateCategory(@PathVariable("id") Long id, @Valid @RequestBody Category category) {
        try {
            Category updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok().body(updatedCategory);
        } catch (ResourceNotFoundException e) {
        	CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No categories Found for this id - "+ id);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/categories/all/" + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    @DeleteMapping("/delete-category")
    public ResponseEntity<Object> deleteCategory(@RequestParam("id") Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok("Category successfully deleted.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found with id: " + id);
        }
    }
    @GetMapping("/count")
    public ResponseEntity<Long> countAllCategories() {
        Long count = categoryService.countAllCategories();
        return ResponseEntity.ok(count);
    }
}
