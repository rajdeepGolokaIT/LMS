package com.sas.SalesAnalysisSystem.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Distributor;
import com.sas.SalesAnalysisSystem.models.DistributorProfile;
import com.sas.SalesAnalysisSystem.models.Product;
import com.sas.SalesAnalysisSystem.repository.DistributorProfileRepository;
import com.sas.SalesAnalysisSystem.repository.DistributorRepository;
import com.sas.SalesAnalysisSystem.repository.ProductRepository;

@Service
public class DistributorServiceImpl implements DistributorService{
	 private final DistributorRepository distributorRepository;
	 private final ProductRepository productRepository;
	 private final DistributorProfileRepository distributorProfileRepository;
	 
	 
	 @Autowired
	    public DistributorServiceImpl(DistributorRepository distributorRepository, ProductRepository productRepository,
			DistributorProfileRepository distributorProfileRepository) {
		this.distributorRepository = distributorRepository;
		this.productRepository = productRepository;
		this.distributorProfileRepository = distributorProfileRepository;
	}

		@Override
	    public List<Distributor> getAllDistributors() {
	        List<Distributor> distributors = distributorRepository.findAll();
	        if (distributors.isEmpty()) {
	            throw new ResourceNotFoundException("No distributors found");
	        }
	        return distributors;
	    }

	    @Override
	    public Distributor getDistributorById(Long id) {
	        Optional<Distributor> distributor = distributorRepository.findById(id);
	        if (distributor.isEmpty()) {
	            throw new ResourceNotFoundException("Distributor not found with id: " + id);
	        }
	        return distributor.get();
	    }

	    @Override
	    public List<Product> getProductsByDistributorId(Long distributorId) {
	        Optional<Distributor> distributor = distributorRepository.findById(distributorId);
	        if (distributor.isEmpty()) {
	            throw new ResourceNotFoundException("Distributor not found with id: " + distributorId);
	        }
	        return distributor.get().getProducts();
	    }
	    
	    
	    
	    // service to add single product
	    @Override
	    public void addProductToDistributor(Long distributorId, Long productId) {
	        Optional<DistributorProfile> distributorProfile = 					distributorProfileRepository.findById(distributorId);
	        
	        if (distributorProfile.isPresent()) {
	            DistributorProfile distributorDb= distributorProfile.get();
	            Distributor newDistributor= new Distributor();
	            newDistributor.setDistributorProfile(distributorDb);
	            Optional<Product> optionalProduct = productRepository.findById(productId);
	            
	            if (optionalProduct.isPresent()) {
	                Product product = optionalProduct.get();
	                List<Product> productList= new ArrayList<>();
	                productList.add(product);
	                newDistributor.setProducts(productList);
	                distributorRepository.save(newDistributor);
	            } else {
	                throw new ResourceNotFoundException("Product not found with id: " + productId);
	            }
	        } else {
	            throw new ResourceNotFoundException("Distributor not found with id: " + distributorId);
	        }
	    }
	    
	    
	    //service to add list of product
	    @Override
	    public void addProductsToDistributor(Long distributorId, List<Long> productIds) {
	        Optional<DistributorProfile> distributorProfileOptional = distributorProfileRepository.findById(distributorId);

	        if (distributorProfileOptional.isPresent()) {
	            DistributorProfile distributorProfile = distributorProfileOptional.get();
	            
	            Distributor newDistributor = new Distributor();
	            newDistributor.setDistributorProfile(distributorProfile);

	            List<Product> products = productRepository.findAllById(productIds);

	            if (!products.isEmpty()) {
	                newDistributor.setProducts(products);
	                distributorRepository.save(newDistributor);
	            } else {
	                throw new ResourceNotFoundException("Products not found with the given IDs");
	            }
	        } else {
	            throw new ResourceNotFoundException("Distributor not found with id: " + distributorId);
	        }
	    }

}
