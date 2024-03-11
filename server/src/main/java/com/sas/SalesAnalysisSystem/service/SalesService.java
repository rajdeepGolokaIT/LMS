package com.sas.SalesAnalysisSystem.service;

import java.util.List;

import com.sas.SalesAnalysisSystem.models.Sales;

public interface SalesService {

	List<Sales> findByInvoice_By_State(String state);

	List<Sales> getSalesByProduct(Long productId);

	List<Sales> getSalesByInvoiceId(Long id);

//	Double getTotalPriceOfAllProductsInInvoices();
}
