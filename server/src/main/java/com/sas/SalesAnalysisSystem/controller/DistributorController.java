package com.sas.SalesAnalysisSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sas.SalesAnalysisSystem.exception.CustomErrorResponse;
import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Distributor;
import com.sas.SalesAnalysisSystem.models.Product;
import com.sas.SalesAnalysisSystem.service.DistributorService;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;



@RestController
@RequestMapping("/api/v1/distributors")
public class DistributorController {
	@Autowired
    private DistributorService distributorService;

    @GetMapping("/all")
    public ResponseEntity<Object> getAllDistributors() {
        try {
            List<Distributor> distributors = distributorService.getAllDistributors();
            return ResponseEntity.ok().body(distributors);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No distributors found");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDistributorById(@PathVariable("id") Long id) {
        try {
            Distributor distributor = distributorService.getDistributorById(id);
            return ResponseEntity.ok().body(distributor);
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No distributor Found for this id - " + id);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/distributors/all/" + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<Object> getProductsByDistributorId(@PathVariable("id") Long id) {
        try {
            List<Product> products = distributorService.getProductsByDistributorId(id);
            return ResponseEntity.ok().body(products);
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No products Found for distributor with id - " + id);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/distributors/all/" + id + "/products");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    @PostMapping("/{distributorId}/add-product")
    public ResponseEntity<Object> addProductToDistributor(
            @PathVariable("distributorId") Long distributorId,
            @RequestParam("productId") Long productId) {
        try {
            distributorService.addProductToDistributor(distributorId, productId);
            return ResponseEntity.ok("Product added to distributor successfully.");
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("Distributor Id Not Found - " + distributorId);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/distributors/" + distributorId + "/add-product");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } 
    }
    
    @PostMapping("/{distributorId}/add-products")
    public ResponseEntity<Object> addProductsToDistributor(
            @PathVariable("distributorId") Long distributorId,
            @RequestParam("productIds") List<Long> productIds)  {
        try {
            distributorService.addProductsToDistributor(distributorId, productIds);
            return ResponseEntity.ok("Products added to distributor successfully.");
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("Distributor Id Not Found - " + distributorId);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/distributors/" + distributorId + "/add-products");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

}
