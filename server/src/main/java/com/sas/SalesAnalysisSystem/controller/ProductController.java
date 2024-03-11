package com.sas.SalesAnalysisSystem.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sas.SalesAnalysisSystem.exception.CustomErrorResponse;
import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Product;
import com.sas.SalesAnalysisSystem.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
	@Autowired
	private ProductService productService;
	
	@GetMapping("/all")
	public ResponseEntity<Object> getAllProduct() {
	    try {
	        List<Product> products = productService.getAllProduct();
	        return ResponseEntity.ok().body( products);
	    } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No products found");
        }
	}
	
	@GetMapping("/{id}")
    public ResponseEntity<Object> getProductById(@PathVariable("id") Long id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok().body(product);
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No product found for this id - " + id);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/products/" + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
	
	@PostMapping("/add-product")
	public ResponseEntity<Object> createProduct(@Valid @RequestBody Product product){
        try {
    		Product createdProduct = productService.createProduct(product);
            return ResponseEntity.ok().body(createdProduct);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
	}
	
	@PutMapping("/update-product/{id}")
    public ResponseEntity<Object> updateProduct(@PathVariable("id") Long id, @Valid @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok().body(updatedProduct);
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No product found for this id - " + id);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/products/update-product/" + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
	
	@DeleteMapping("/delete-product")
    public ResponseEntity<Object> deleteProducts(@RequestParam("id") Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product successfully deleted.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with id: " + id);
        }
    }
	
	@GetMapping("/count")
    public ResponseEntity<Long> countAllCategories() {
        Long count = productService.countAllProducts();
        return ResponseEntity.ok(count);
    }
	
}
