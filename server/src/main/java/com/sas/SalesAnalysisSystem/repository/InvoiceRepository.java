package com.sas.SalesAnalysisSystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.sas.SalesAnalysisSystem.models.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long>{

}