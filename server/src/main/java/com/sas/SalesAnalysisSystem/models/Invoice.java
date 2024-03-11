package com.sas.SalesAnalysisSystem.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "invoice")
public class Invoice extends BaseEntity {

	@Column(name = "invoice_number")
    private double InvoiceNumber;
	
	@Column(name = "irn")
    private double IRN;
	
	@Column(name = "Ack_No")
    private double AckNo;
	
	@Column(name = "dispatched_through")
    private String DispatchedThrough;
	
	@Column(name = "destination")
    private String Destination;
	
	@Column(name = "vehicle_no")
    private String vechicleNo;

    @Column(name = "cgst")
    private double cgst;

    @Column(name = "sgst")
    private double sgst;

    @Column(name = "total_amount")
    private double totalAmount;

    @Column(name = "purchase_number")
    private String purchaseNumber;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "discount")
    private double discount;

    @Column(name = "quantity")
    private int quantity;
    
    @Column(name = "HSN/SAC")
    private double HSNSAC;
    
    @Column(name = "amount")
    private double Amount;
    
    @Column(name = "terms_of_delivery")
    private String TermsOfDelivery;
    
//    @OneToOne
//    @JoinColumn(name = "eway_id")
//    private Eway eway;
    
//    @Column(name="eway-Doc_No")
//    private String ewayDocNumber;
//    
//    @Column(name="eway-Bill_No")
//    private String eWayBillNo ;
//    
//    @Column(name="eway-Mode")
//    private String eWayMode ;
//    
//    @Column(name="eway-Approx-distance")
//    private String eWayApproxDistance ;
//    
//    @Column(name="eway-valid-Upto")
//    private String eWayValidUpto ;
//    
//    @Column(name="eway-Supply-type")
//    private String eWaySupplyType;
//    
//    @Column(name="eway-transaction-type")
//    private String eWayTransactionType ;
//    
//    @Column(name="eway-GSTIN")
//    private String eWayGSTIN ;
//    
//    @Column(name="eway-from")
//    private String eWayfrom ;
//    
//    @Column(name="eway-to")
//    private String eWayTo ;
//    
//    @Column(name="eway-dispatch-from")
//    private String eWayDistpatchFrom ;
//    
//    @Column(name="eway-ship-to")
//    private String eWayShipTo ;
//    
//    @Column(name = "eway_tax_amount")
//    private double ewaytaxAmount;
//    
//    @Column(name = "eway_Tax_rate")
//    private double ewayTaxRate;
//    
//    @Column(name = "eway_TransportationID")
//    private double ewayTransportationID;
//    
//    @Column(name = "eway_VechileNo")
//    private double ewayVechileNo;
//    
//    @Column(name = "eway_VehicleFrom")
//    private double ewayVehicleFrom;
//    
    @ManyToOne
    @JoinColumn(name = "distributor_id")
    private Distributor distributor;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "product_invoice",
        joinColumns = @JoinColumn(name = "invoice_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products = new ArrayList<>();
    
    @Column(name = "is_active")
    private Boolean isActive = true;

	public double getInvoiceNumber() {
		return InvoiceNumber;
	}

	public void setInvoiceNumber(double invoiceNumber) {
		InvoiceNumber = invoiceNumber;
	}

	public double getIRN() {
		return IRN;
	}

	public void setIRN(double iRN) {
		IRN = iRN;
	}

	public double getAckNo() {
		return AckNo;
	}

	public void setAckNo(double ackNo) {
		AckNo = ackNo;
	}

	public String getDispatchedThrough() {
		return DispatchedThrough;
	}

	public void setDispatchedThrough(String dispatchedThrough) {
		DispatchedThrough = dispatchedThrough;
	}

	public String getDestination() {
		return Destination;
	}

	public void setDestination(String destination) {
		Destination = destination;
	}

	public String getVechicleNo() {
		return vechicleNo;
	}

	public void setVechicleNo(String vechicleNo) {
		this.vechicleNo = vechicleNo;
	}

	public double getCgst() {
		return cgst;
	}

	public void setCgst(double cgst) {
		this.cgst = cgst;
	}

	public double getSgst() {
		return sgst;
	}

	public void setSgst(double sgst) {
		this.sgst = sgst;
	}

	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public String getPurchaseNumber() {
		return purchaseNumber;
	}

	public void setPurchaseNumber(String purchaseNumber) {
		this.purchaseNumber = purchaseNumber;
	}

	public LocalDate getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(LocalDate deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}

	public double getDiscount() {
		return discount;
	}

	public void setDiscount(double discount) {
		this.discount = discount;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getHSNSAC() {
		return HSNSAC;
	}

	public void setHSNSAC(double hSNSAC) {
		HSNSAC = hSNSAC;
	}

	public double getAmount() {
		return Amount;
	}

	public void setAmount(double amount) {
		Amount = amount;
	}

	public String getTermsOfDelivery() {
		return TermsOfDelivery;
	}

	public void setTermsOfDelivery(String termsOfDelivery) {
		TermsOfDelivery = termsOfDelivery;
	}

//	public Eway getEway() {
//		return eway;
//	}
//
//	public void setEway(Eway eway) {
//		this.eway = eway;
//	}

	public Distributor getDistributor() {
		return distributor;
	}

	public void setDistributor(Distributor distributor) {
		this.distributor = distributor;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

	public Boolean getIsActive() {
		return isActive;
	}

	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
    
    

	
}

