package com.sas.SalesAnalysisSystem.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Salesperson;
import com.sas.SalesAnalysisSystem.repository.SalespersonRepository;

@Service
public class salespersonServiceImpl implements SalespersonService{
	
	private final SalespersonRepository salespersonRepository ;

    @Autowired
    public salespersonServiceImpl(SalespersonRepository salespersonRepository) {
        this.salespersonRepository = salespersonRepository;
    }

    @Override
    public Salesperson getSalespersonById(Long salespersonId) {
        Optional<Salesperson> salespersonDb = salespersonRepository.findById(salespersonId);
        if (salespersonDb.isEmpty()) {
            throw new ResourceNotFoundException("Record not found with id: " + salespersonId);
        }
        return salespersonDb.get();
    }

    @Override
    public List<Salesperson> getAllSalespersons() {
        List<Salesperson> salespersons = salespersonRepository.findAll();
        if (salespersons.isEmpty()) {
            throw new ResourceNotFoundException("No salespersons found.");
        }
        return salespersons;
    }
	@Override
    public void deleteSalesperson(Long salespersonId) {
        Optional<Salesperson> salespersonDb = salespersonRepository.findById(salespersonId);
        if (salespersonDb.isPresent()) {
            salespersonRepository.delete(salespersonDb.get());
        } else {
            throw new ResourceNotFoundException("Record not found with id: " + salespersonId);
        }
    }

	@Override
	public Salesperson createSalesperson(Salesperson salesperson) {
	    if (salesperson.getName() == null || salesperson.getName().isEmpty()) {
	        throw new IllegalArgumentException("Salesperson name cannot be null or empty.");
	    }
	    if (salespersonRepository.existsByName(salesperson.getName())) {
	        throw new IllegalArgumentException("Salesperson with the same name already exists.");
	    }
	    return salespersonRepository.save(salesperson);
	}


	@Override
    public Salesperson updateSalesperson(Long id, Salesperson salesperson) {
        Optional<Salesperson> salespersonDb = salespersonRepository.findById(id);
        if (salespersonDb.isPresent()) {
            Salesperson salespersonUpdate = salespersonDb.get();
            salespersonUpdate.setName(salesperson.getName());
            salespersonUpdate.setContactNumber(salesperson.getContactNumber());
            salespersonUpdate.setEmail(salesperson.getEmail());
            salespersonUpdate.setIsActive(salesperson.getIsActive());
            salespersonUpdate.setDistributor(salesperson.getDistributor());
            return salespersonRepository.save(salespersonUpdate);
        } else {
            throw new ResourceNotFoundException("Record not found with id: " + id);
        }
    }

}
