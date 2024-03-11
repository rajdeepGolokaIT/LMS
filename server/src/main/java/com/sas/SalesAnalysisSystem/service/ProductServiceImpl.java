package com.sas.SalesAnalysisSystem.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Category;
import com.sas.SalesAnalysisSystem.models.Product;
import com.sas.SalesAnalysisSystem.repository.CategoryRepository;
import com.sas.SalesAnalysisSystem.repository.ProductRepository;


@Service
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository,CategoryRepository categoryRepository) {
    	
        this.productRepository = productRepository;
        this.categoryRepository=categoryRepository;
        
    }

    @Override
    public Product createProduct(Product product) {
    	Optional<Category> categoryOptional = categoryRepository.findById(product.getCategory().getId());
        if (categoryOptional.isPresent()) {
            return productRepository.save(product);
        } else {
            throw new ResourceNotFoundException("Category not found with id: " + product.getCategory().getId());
        }
        
    }
    public List<Product> getProductsByIds(List<Long> productIds) {
        return productRepository.findAllById(productIds);
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        Optional<Product> productDb = productRepository.findById(id);
    	Optional<Category> categoryOptional = categoryRepository.findById(product.getCategory().getId());
    	if (!categoryOptional.isPresent()) {
            throw new ResourceNotFoundException("Category not found with id: " + product.getCategory().getId());
        }
        if (productDb.isPresent()) {
            Product productUpdate = productDb.get();
            productUpdate.setProductName(product.getProductName());
            productUpdate.setPrice(product.getPrice());
            productUpdate.setCategory(product.getCategory());
            productUpdate.setIsActive(product.getIsActive());
            return productRepository.save(productUpdate);
        } else {
            throw new ResourceNotFoundException("Record not found with id: " + product.getId());
        }
    }

    @Override
    public List<Product> getAllProduct() {
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()){
            throw new ResourceNotFoundException("No Product found");
        }
        return products;
    }

    @Override
    public Product getProductById(Long productId) {
        Optional<Product> productDb = productRepository.findById(productId);
        if (productDb.isEmpty()) {
            throw new ResourceNotFoundException("Record not found with id: " + productId);
        }
        return productDb.get();
    }


    @Override
    public void deleteProduct(Long productId) {
        Optional<Product> productDb = productRepository.findById(productId);
        if (productDb.isPresent()) {
            productRepository.delete(productDb.get());
        } else {
            throw new ResourceNotFoundException("Record not found with id: " + productId);
        }
    }

    public Long countAllProducts() {
        return productRepository.countAllProducts();
    }


}
