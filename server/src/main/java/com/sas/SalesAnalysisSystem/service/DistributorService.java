package com.sas.SalesAnalysisSystem.service;

import java.util.List;

import com.sas.SalesAnalysisSystem.models.Distributor;
import com.sas.SalesAnalysisSystem.models.Product;

public interface DistributorService {
	
	List<Distributor> getAllDistributors();

    Distributor getDistributorById(Long id);

    List<Product> getProductsByDistributorId(Long distributorId);

	void addProductToDistributor(Long distributorId, Long productId);

	void addProductsToDistributor(Long distributorId, List<Long> productIds);

}
