package com.sas.SalesAnalysisSystem.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Sales;
import com.sas.SalesAnalysisSystem.repository.SalesRepository;

@Service
public class SalesServiceImpl implements SalesService {
	
	@Autowired
	private final SalesRepository salesRepository;

    public SalesServiceImpl(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }
    
//    @Override
//    public Double getTotalPriceOfAllProductsInInvoices() {
//        java.util.Optional<Double> totalPriceOptional = salesRepository.sumPrice();
//        return 0.0;
//    }
    
    @Override
    public List<Sales> findByInvoice_By_State(String region) {
        List<Sales> sales = salesRepository.findByInvoice_Distributor_DistributorProfile_State(region);
        if (sales.isEmpty()) {
            throw new ResourceNotFoundException("No sales records found for the specified region");
        }
        return sales;
    }

    @Override
    public List<Sales> getSalesByProduct(Long productId) {
        List<Sales> sales = salesRepository.findByInvoice_Distributor_Products_Id(productId);
        if (sales.isEmpty()) {
            throw new ResourceNotFoundException("No sales records found for the specified product");
        }
        return sales;
    }

    @Override
    public List<Sales> getSalesByInvoiceId(Long id) {
        List<Sales> sales = salesRepository.findByInvoiceId(id);
        if (sales.isEmpty()) {
            throw new ResourceNotFoundException("No sales records found for the specified invoice ID");
        }
        return sales;
    }

}
