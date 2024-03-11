package com.sas.SalesAnalysisSystem.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Category;
import com.sas.SalesAnalysisSystem.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {
	
	private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    @Override
    public Category createCategory(Category category) {
    	if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be null or empty.");
        }
    	if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new IllegalArgumentException("Category with the same name already exists.");
        }
    	Category savedCategory = categoryRepository.save(category);
        return savedCategory;
    }

    @Override
    public Category updateCategory(Long id,Category category) {
        Optional<Category> categoryDb = categoryRepository.findById(id);
        if (categoryDb.isPresent()) {
            Category categoryUpdate = categoryDb.get();
            categoryUpdate.setCategoryName(category.getCategoryName());
            categoryUpdate.setIsActive(category.getIsActive());
            return categoryRepository.save(categoryUpdate);
        } else {
            throw new ResourceNotFoundException("Record not found with id: " + id);
        }
    }

    @Override
    public List<Category> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) {
            throw new ResourceNotFoundException("No categories found " + categories.size());
        }
        return categories;
    }

    @Override
    public Category getCategoryById(Long categoryId) {
    	Optional<Category> categoryDb = categoryRepository.findById(categoryId);
        if (categoryDb.isEmpty()) {
            throw new ResourceNotFoundException("Record not found with id: " + categoryId);
        }
        return categoryDb.get();
    }

    @Override
    public void deleteCategory(Long categoryId) {
        Optional<Category> categoryDb = categoryRepository.findById(categoryId);
        if (categoryDb.isPresent()) {
        	categoryRepository.delete(categoryDb.get());
        } else {
            throw new ResourceNotFoundException("Record not found with id: " + categoryId);
        }
    }
    @Override
    public Long countAllCategories() {
        return categoryRepository.countAllCategories();
    }
    
}
