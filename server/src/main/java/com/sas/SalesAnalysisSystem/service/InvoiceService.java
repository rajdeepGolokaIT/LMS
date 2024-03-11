package com.sas.SalesAnalysisSystem.service;

import java.time.LocalDate;
import java.util.List;

import com.sas.SalesAnalysisSystem.models.Invoice;

public interface InvoiceService {
	Invoice createInvoice(Invoice invoice);
	List<Invoice> getAllInvoices();
	void deleteInvoice(Long invoice_number);
	Invoice updateInvoice(Long id, Invoice updatedInvoice);
	Invoice getInvoiceById(Long id);

}
