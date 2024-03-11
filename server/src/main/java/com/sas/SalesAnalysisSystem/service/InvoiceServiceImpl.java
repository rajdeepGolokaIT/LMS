package com.sas.SalesAnalysisSystem.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Invoice;
import com.sas.SalesAnalysisSystem.repository.InvoiceRepository;

@Service
public class InvoiceServiceImpl  implements InvoiceService{
	
	private final InvoiceRepository invoiceRepository;
	
	@Autowired
	public InvoiceServiceImpl(InvoiceRepository invoiceRepository) {
		this.invoiceRepository = invoiceRepository;
	}
	
	@Override
	public Invoice createInvoice(Invoice invoice) {
	    if (invoice.getAmount() <= 0) {
	        throw new IllegalArgumentException("Net amount must be greater than 0.");
	    }
	    return invoiceRepository.save(invoice);
	}
	@Override
    public Invoice getInvoiceById(Long id) {
        Optional<Invoice> optionalInvoice = invoiceRepository.findById(id);
        if (optionalInvoice.isPresent()) {
            return optionalInvoice.get();
        } else {
            throw new ResourceNotFoundException("Invoice not found with invoice number: " + id);
        }
    }


	@Override
	public List<Invoice> getAllInvoices() {
	    List<Invoice> invoices = invoiceRepository.findAll();
	    if (invoices.isEmpty()) {
	        throw new ResourceNotFoundException("No invoices found");
	    }
	    return invoices;
	}


	@Override
	public Invoice updateInvoice(Long id, Invoice updatedInvoice) {
	    Optional<Invoice> invoiceDb = invoiceRepository.findById(id);

	    if (invoiceDb.isPresent()) {
	        Invoice invoiceUpdate = invoiceDb.get();
	        invoiceUpdate.setInvoiceNumber(updatedInvoice.getInvoiceNumber());
	        invoiceUpdate.setIRN(updatedInvoice.getIRN());
	        invoiceUpdate.setAckNo(updatedInvoice.getAckNo());
	        invoiceUpdate.setDispatchedThrough(updatedInvoice.getDispatchedThrough());
	        invoiceUpdate.setDestination(updatedInvoice.getDestination());
	        invoiceUpdate.setVechicleNo(updatedInvoice.getVechicleNo());
	        invoiceUpdate.setCgst(updatedInvoice.getCgst());
	        invoiceUpdate.setSgst(updatedInvoice.getSgst());
	        invoiceUpdate.setTotalAmount(updatedInvoice.getTotalAmount());
	        invoiceUpdate.setPurchaseNumber(updatedInvoice.getPurchaseNumber());
	        invoiceUpdate.setDeliveryDate(updatedInvoice.getDeliveryDate());
	        invoiceUpdate.setSupplierName(updatedInvoice.getSupplierName());
	        invoiceUpdate.setDiscount(updatedInvoice.getDiscount());
	        invoiceUpdate.setQuantity(updatedInvoice.getQuantity());
	        invoiceUpdate.setHSNSAC(updatedInvoice.getHSNSAC());
	        invoiceUpdate.setAmount(updatedInvoice.getAmount());
	        invoiceUpdate.setTermsOfDelivery(updatedInvoice.getTermsOfDelivery());
	        invoiceUpdate.setDistributor(updatedInvoice.getDistributor());
	        invoiceUpdate.setProducts(updatedInvoice.getProducts());
	        invoiceUpdate.setIsActive(updatedInvoice.getIsActive());

	        return invoiceRepository.save(invoiceUpdate);
	    } else {
	        throw new ResourceNotFoundException("Record not found with id: " + id);
	    }
	}



	@Override
    public void deleteInvoice(Long id) {
        Optional<Invoice> optionalInvoice = invoiceRepository.findById(id);
        if (optionalInvoice.isPresent()) {
            invoiceRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Invoice not found with invoice number: " + id);
        }
    }

}
