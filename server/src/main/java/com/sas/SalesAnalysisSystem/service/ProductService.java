package com.sas.SalesAnalysisSystem.service;

import java.util.List;

import com.sas.SalesAnalysisSystem.models.Product;

public interface ProductService {
	Product getProductById(Long productId);

	List<Product> getAllProduct();

	void deleteProduct(Long productId);

	Product updateProduct(Long id,Product product);

	Product createProduct(Product product);

	Long countAllProducts();

}
