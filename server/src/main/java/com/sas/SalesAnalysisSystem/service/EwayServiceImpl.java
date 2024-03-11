package com.sas.SalesAnalysisSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Eway;
import com.sas.SalesAnalysisSystem.repository.EwayRepository;

@Service
public class EwayServiceImpl implements EwayService{

    private final EwayRepository ewayRepository;

    @Autowired
    public EwayServiceImpl(EwayRepository ewayRepository) {
        this.ewayRepository = ewayRepository;
    }

    @Override
    public Eway createEway(Eway eway) {
        if (eway.getEwayDocNumber() == null || eway.getEwayDocNumber().isEmpty()) {
            throw new IllegalArgumentException("Eway document number cannot be null or empty.");
        }
        Eway savedEway = ewayRepository.save(eway);
        return savedEway;
    }

    @Override
    public Eway updateEway(Long id, Eway updatedEway) {
        Optional<Eway> ewayDb = ewayRepository.findById(id);
        if (ewayDb.isPresent()) {
            Eway existingEway = ewayDb.get();
            
            existingEway.setEwayDocNumber(updatedEway.getEwayDocNumber());
            existingEway.seteWayBillNo(updatedEway.geteWayBillNo());
            existingEway.seteWayBillNo(updatedEway.geteWayBillNo());
            existingEway.seteWayApproxDistance(updatedEway.geteWayApproxDistance());
            existingEway.seteWayValidUpto(updatedEway.geteWayValidUpto());
            existingEway.seteWaySupplyType(updatedEway.geteWaySupplyType());
            existingEway.seteWayTransactionType(updatedEway.geteWayTransactionType());
            existingEway.seteWayGSTIN(updatedEway.geteWayGSTIN());
            existingEway.seteWayfrom(updatedEway.geteWayfrom());
            existingEway.seteWayTo(updatedEway.geteWayTo());
            existingEway.seteWayDistpatchFrom(updatedEway.geteWayDistpatchFrom());
            existingEway.seteWayShipTo(updatedEway.geteWayShipTo());
            existingEway.setEwaytaxAmount(updatedEway.getEwaytaxAmount());
            existingEway.setEwayTaxRate(updatedEway.getEwayTaxRate());
            existingEway.setEwayTransportationID(updatedEway.getEwayTransportationID());
            existingEway.setEwayVechileNo(updatedEway.getEwayVechileNo());
            existingEway.setEwayVehicleFrom(updatedEway.getEwayVehicleFrom());

            return ewayRepository.save(existingEway);
        } else {
            throw new ResourceNotFoundException("Record not found with id: " + id);
        }
    }


    @Override
    public List<Eway> getAllEways() {
        List<Eway> eways = ewayRepository.findAll();
        if (eways.isEmpty()) {
            throw new ResourceNotFoundException("No Eways found " + eways.size());
        }
        return eways;
    }

    @Override
    public Eway getEwayById(Long ewayId) {
        Optional<Eway> ewayDb = ewayRepository.findById(ewayId);
        if (ewayDb.isEmpty()) {
            throw new ResourceNotFoundException("Record not found with id: " + ewayId);
        }
        return ewayDb.get();
    }

    @Override
    public void deleteEway(Long ewayId) {
        Optional<Eway> ewayDb = ewayRepository.findById(ewayId);
        if (ewayDb.isPresent()) {
            ewayRepository.delete(ewayDb.get());
        } else {
            throw new ResourceNotFoundException("Record not found with id: " + ewayId);
        }
    }
}
