package com.sas.SalesAnalysisSystem.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "eway")
public class Eway extends BaseEntity {

	@Column(name = "eway_Doc_No")
    private String ewayDocNumber;

    @Column(name = "eway_Bill_No")
    private String eWayBillNo;

    @Column(name = "eway_Mode")
    private String eWayMode;

    @Column(name = "eway_Approx_distance")
    private String eWayApproxDistance;

    @Column(name = "eway_Valid_Upto")
    private String eWayValidUpto;

    @Column(name = "eway_Supply_type")
    private String eWaySupplyType;

    @Column(name = "eway_transaction_type")
    private String eWayTransactionType;

    @Column(name = "eway_GSTIN")
    private String eWayGSTIN;

    @Column(name = "eway_from")
    private String eWayfrom;

    @Column(name = "eway_to")
    private String eWayTo;

    @Column(name = "eway_dispatch_from")
    private String eWayDistpatchFrom;

    @Column(name = "eway_ship_to")
    private String eWayShipTo;

    @Column(name = "eway_tax_amount")
    private double ewaytaxAmount;

    @Column(name = "eway_Tax_rate")
    private double ewayTaxRate;

    @Column(name = "eway_TransportationID")
    private double ewayTransportationID;

    @Column(name = "eway_VechileNo")
    private double ewayVechileNo;

    @Column(name = "eway_VehicleFrom")
    private double ewayVehicleFrom;
    
//    @OneToOne(mappedBy = "eway_id")
//    private Invoice invoice;

	public String getEwayDocNumber() {
		return ewayDocNumber;
	}

	public String geteWayBillNo() {
		return eWayBillNo;
	}

	public void seteWayBillNo(String eWayBillNo) {
		this.eWayBillNo = eWayBillNo;
	}

	public String geteWayMode() {
		return eWayMode;
	}

	public void seteWayMode(String eWayMode) {
		this.eWayMode = eWayMode;
	}

	public String geteWayApproxDistance() {
		return eWayApproxDistance;
	}

	public void seteWayApproxDistance(String eWayApproxDistance) {
		this.eWayApproxDistance = eWayApproxDistance;
	}

	public String geteWayValidUpto() {
		return eWayValidUpto;
	}

	public void seteWayValidUpto(String eWayValidUpto) {
		this.eWayValidUpto = eWayValidUpto;
	}

	public String geteWaySupplyType() {
		return eWaySupplyType;
	}

	public void seteWaySupplyType(String eWaySupplyType) {
		this.eWaySupplyType = eWaySupplyType;
	}

	public String geteWayTransactionType() {
		return eWayTransactionType;
	}

	public void seteWayTransactionType(String eWayTransactionType) {
		this.eWayTransactionType = eWayTransactionType;
	}

	public String geteWayGSTIN() {
		return eWayGSTIN;
	}

	public void seteWayGSTIN(String eWayGSTIN) {
		this.eWayGSTIN = eWayGSTIN;
	}

	public String geteWayfrom() {
		return eWayfrom;
	}

	public void seteWayfrom(String eWayfrom) {
		this.eWayfrom = eWayfrom;
	}

	public String geteWayTo() {
		return eWayTo;
	}

	public void seteWayTo(String eWayTo) {
		this.eWayTo = eWayTo;
	}

	public String geteWayDistpatchFrom() {
		return eWayDistpatchFrom;
	}

	public void seteWayDistpatchFrom(String eWayDistpatchFrom) {
		this.eWayDistpatchFrom = eWayDistpatchFrom;
	}

	public String geteWayShipTo() {
		return eWayShipTo;
	}

	public void seteWayShipTo(String eWayShipTo) {
		this.eWayShipTo = eWayShipTo;
	}

	public double getEwaytaxAmount() {
		return ewaytaxAmount;
	}

	public void setEwaytaxAmount(double ewaytaxAmount) {
		this.ewaytaxAmount = ewaytaxAmount;
	}

	public double getEwayTaxRate() {
		return ewayTaxRate;
	}

	public void setEwayTaxRate(double ewayTaxRate) {
		this.ewayTaxRate = ewayTaxRate;
	}

	public double getEwayTransportationID() {
		return ewayTransportationID;
	}

	public void setEwayTransportationID(double ewayTransportationID) {
		this.ewayTransportationID = ewayTransportationID;
	}

	public double getEwayVechileNo() {
		return ewayVechileNo;
	}

	public void setEwayVechileNo(double ewayVechileNo) {
		this.ewayVechileNo = ewayVechileNo;
	}

	public double getEwayVehicleFrom() {
		return ewayVehicleFrom;
	}

	public void setEwayVehicleFrom(double ewayVehicleFrom) {
		this.ewayVehicleFrom = ewayVehicleFrom;
	}

	public void setEwayDocNumber(String ewayDocNumber) {
		this.ewayDocNumber = ewayDocNumber;
	}


}
