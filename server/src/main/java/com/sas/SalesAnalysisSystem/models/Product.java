package com.sas.SalesAnalysisSystem.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The {@code Product} class represents a product in the Sales Analysis System.
 * It is annotated as an entity, extending the {@code BaseEntity} class.
 * Each product belongs to a specific category, forming a many-to-one relationship
 * with the {@code Category} class.
 *
 * @author Neha Pal
 * @version 1.0
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product")
@NamedQuery(
		name = "Product.countAllProducts",
	    query = "SELECT COUNT(p) FROM Product p"	
		)
public class Product extends BaseEntity {

    /**
     * Represents the name of the product.
     */
    @Column(name = "product_name")
    private String productName;

    /**
     * Represents the price of the product.
     */
    
    @Column(name = "price")
    private int price;
    
    /**
     * Indicates whether the product is active or inactive.
     * Default value is true.
     */
    
    @Column(name = "is_active")
    private Boolean isActive = true;

    /**
     * Represents the category to which the product belongs.
     * This is a many-to-one relationship, and the {@code JoinColumn} annotation is used
     * to specify the column name for the foreign key.
     */
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    

    @ManyToMany(mappedBy = "products")
    private List<Invoice> invoices = new ArrayList<>();

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public Boolean getIsActive() {
		return isActive;
	}

	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
    

}
