package com.sas.SalesAnalysisSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sas.SalesAnalysisSystem.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	boolean existsByCategoryName(String categoryName);
	Long countAllCategories();
}
