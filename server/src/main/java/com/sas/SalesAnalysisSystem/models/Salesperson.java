package com.sas.SalesAnalysisSystem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The {@code Salesperson} class represents a salesperson in the Sales Analysis System.
 * It is annotated as an entity, extending the {@code BaseEntity} class.
 * Each salesperson has a many-to-one relationship with a distributor.
 *
 * @author Neha Pal
 * @version 1.0
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "salesperson")
public class Salesperson extends BaseEntity {
    /**
     * Represents the name of the salesperson.
     */
    @Column(name = "Name")
    private String name;
    
    /**
     * Represents the contact number of the salesperson.
     */
    @Column(name = "ContactNumber")
    private String contactNumber;

    /**
     * Represents the email of the salesperson.
     */
    @Column(name = "Email")
    private String email;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    /**
     * Represents the distributor associated with this salesperson.
     * This is a many-to-one relationship with the {@code Distributor} class,
     * and the {@code JoinColumn} annotation is used to specify the column name for the foreign key.
     */
    @ManyToOne
    @JoinColumn(name = "distributor_id")
    private Distributor distributor;
    
    
    
    
    
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getContactNumber() {
		return contactNumber;
	}
	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	public Distributor getDistributor() {
		return distributor;
	}
	public void setDistributor(Distributor distributor) {
		this.distributor = distributor;
	}

}
