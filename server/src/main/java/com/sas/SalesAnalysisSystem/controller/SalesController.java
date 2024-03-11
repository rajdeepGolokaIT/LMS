package com.sas.SalesAnalysisSystem.controller;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sas.SalesAnalysisSystem.exception.CustomErrorResponse;
import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Sales;
import com.sas.SalesAnalysisSystem.service.SalesService;

@RestController
@RequestMapping("/api/v1/sales")
public class SalesController {

    private final SalesService salesService;
    
    @Autowired
    public SalesController(SalesService salesService) {
		this.salesService = salesService;
	}

	@GetMapping("/get-by-distributor-region")
    public ResponseEntity<Object> getSalesByDistributorRegion(@RequestParam("region") String region) {
        try {
            List<Sales> sales = salesService.findByInvoice_By_State(region);
            return ResponseEntity.ok().body(sales);
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No sales records found for this distributor region - " + region);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/sales/get-by-distributor-region?region=" + region);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
	
//	@GetMapping("/totalPriceOfProductsInInvoices")
//    public ResponseEntity<Double> getTotalPriceOfAllProductsInInvoices() {
//        Double totalPrice = salesService.getTotalPriceOfAllProductsInInvoices();
//        return ResponseEntity.ok(totalPrice);
//    }
	
    @GetMapping("/get-by-product")
    public ResponseEntity<Object> getSalesByProduct(@RequestParam("productId") Long productId) {
        try {
            List<Sales> sales = salesService.getSalesByProduct(productId);
            return ResponseEntity.ok().body(sales);
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No sales records found for this product ID - " + productId);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/sales/get-by-product?productId=" + productId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/get-by-invoice-id")
    public ResponseEntity<Object> getSalesByInvoiceNumber(@RequestParam("invoiceNumber") Long id) {
        try {
            List<Sales> sales = salesService.getSalesByInvoiceId(id);
            return ResponseEntity.ok().body(sales);
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No sales records found for this invoice number - " + id);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/sales/get-by-invoice-number?invoiceNumber=" + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
}

