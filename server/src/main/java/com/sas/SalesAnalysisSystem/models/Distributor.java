package com.sas.SalesAnalysisSystem.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The {@code Distributor} class represents a distributor in the Sales Analysis System.
 * It is annotated as an entity, extending the {@code BaseEntity} class.
 * Each distributor has a profile associated with it, forming a one-to-one relationship
 * with the {@code DistributorProfile} class.
 *
 * @author Neha Pal
 * @version 1.0
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "distributor")
public class Distributor extends BaseEntity {

	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_id")
    private DistributorProfile distributorProfile;

    @ManyToMany
    @JoinTable(
        name = "distributor_product",
        joinColumns = @JoinColumn(name = "distributor_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products;

	public DistributorProfile getDistributorProfile() {
		return distributorProfile;
	}

	public void setDistributorProfile(DistributorProfile distributorProfile) {
		this.distributorProfile = distributorProfile;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

	@Override
	public String toString() {
		return "Distributor [distributorProfile=" + distributorProfile + ", products=" + products + "]";
	}
	

	

}

