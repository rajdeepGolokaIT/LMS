package com.sas.SalesAnalysisSystem.service;

import java.util.List;

import com.sas.SalesAnalysisSystem.models.Category;

public interface CategoryService {

    Category getCategoryById(Long categoryId);

    void deleteCategory(Long categoryId);

    Category createCategory(Category category);

	Category updateCategory(Long id, Category category);

	Long countAllCategories();

	List<Category> getAllCategories();
}

