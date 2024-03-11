package com.sas.SalesAnalysisSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sas.SalesAnalysisSystem.models.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	Long countAllProducts();
}
