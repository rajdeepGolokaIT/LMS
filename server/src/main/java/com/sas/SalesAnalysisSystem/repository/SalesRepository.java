package com.sas.SalesAnalysisSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sas.SalesAnalysisSystem.models.Sales;

public interface SalesRepository extends JpaRepository<Sales, Long> {

	List<Sales> findByInvoice_Distributor_DistributorProfile_State(String state);

	List<Sales> findByInvoice_Distributor_Products_Id(Long productId);

	List<Sales> findByInvoiceId(Long id);
	
//    Optional<Double> sumPriceOfProducts();
	
//	Optional<Double> findByInvoice_Products_Price();
	 
	
}