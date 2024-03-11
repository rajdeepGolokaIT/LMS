package com.sas.SalesAnalysisSystem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a Sales entity in the Sales Analysis System.
 * Each Sales record is associated with an Invoice, product name, and region.
 * It includes details such as the number of products sold, total amount, and total quantity.
 *
 * The Sales class is used to generate sales records based on invoice number, product name, and region.
 *
 * @author Neha Pal
 * @version 1.0
 * @see BaseEntity
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sales")
public class Sales extends BaseEntity {

    /**
     * Number of products sold in the sales record.
     */
    @Column(name = "no_of_product_sold")
    private int numberOfProductSold;

    /**
     * Total amount of the sales record.
     */
    @Column(name = "total_amount")
    private int totalAmount;

    /**
     * Total quantity of products in the sales record.
     */
    @Column(name = "total_quantity")
    private int totalQuantity;

    /**
     * Invoice associated with the sales record.
     */
    @ManyToOne
    @JoinColumn(name = "invoice_no")
    private Invoice invoice;

	public int getNumberOfProductSold() {
		return numberOfProductSold;
	}

	public void setNumberOfProductSold(int numberOfProductSold) {
		this.numberOfProductSold = numberOfProductSold;
	}

	public int getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(int totalAmount) {
		this.totalAmount = totalAmount;
	}

	public int getTotalQuantity() {
		return totalQuantity;
	}

	public void setTotalQuantity(int totalQuantity) {
		this.totalQuantity = totalQuantity;
	}

	public Invoice getInvoice() {
		return invoice;
	}

	public void setInvoice(Invoice invoice) {
		this.invoice = invoice;
	}
    
    

}

