package com.sas.SalesAnalysisSystem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.NamedQuery;
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
@Table(name = "distributor_profile")
@NamedQuery(
	    name = "DistributorProfile.countAllDistributorProfile",
	    query = "SELECT COUNT(dp) FROM DistributorProfile dp"
	)
public class DistributorProfile extends BaseEntity {

    @Column(name = "Address")
    private String address;


    @Column(name = "State")
    private String state;

    @Column(name = "AgencyName")
    private String agencyName;


    @Column(name = "ContactPerson")
    private String contactPerson;


    @Column(name = "ContactNumber")
    private String contactNumber;


    @Column(name = "Email")
    private String email;
    
    public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getAgencyName() {
		return agencyName;
	}

	public void setAgencyName(String agencyName) {
		this.agencyName = agencyName;
	}

	public String getContactPerson() {
		return contactPerson;
	}

	public void setContactPerson(String contactPerson) {
		this.contactPerson = contactPerson;
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

	@Column(name = "is_active")
    private Boolean isActive = true;

}
