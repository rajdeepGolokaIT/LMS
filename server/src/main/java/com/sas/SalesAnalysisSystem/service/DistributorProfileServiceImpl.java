package com.sas.SalesAnalysisSystem.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.DistributorProfile;
import com.sas.SalesAnalysisSystem.repository.DistributorProfileRepository;

@Service
public class DistributorProfileServiceImpl implements DistributorProfileService {
	
	private final DistributorProfileRepository distributorProfileRepository;

    @Autowired
    public DistributorProfileServiceImpl(DistributorProfileRepository distributorProfileRepository) {
        this.distributorProfileRepository = distributorProfileRepository;
    }

	@Override
	public DistributorProfile getDistributorProfileById(Long id) {
	    Optional<DistributorProfile> distributorProfile = distributorProfileRepository.findById(id);
	    if (!distributorProfile.isPresent()) {
	        throw new ResourceNotFoundException("Record not found with id: " + id);
	    }
	    return distributorProfile.get();
	}

	@Override
	public List<DistributorProfile> getAllDistributorProfile() {
		List<DistributorProfile> distributorProfile = distributorProfileRepository.findAll();
        if (distributorProfile.isEmpty()) {
            throw new ResourceNotFoundException("No categories found " + distributorProfile.size());
        }
        return distributorProfile;
	}

	@Override
	public void deleteDistributorProfile(Long Id) {
		Optional<DistributorProfile> distributorDb = distributorProfileRepository.findById(Id);
        if (distributorDb.isPresent()) {
        	distributorProfileRepository.delete(distributorDb.get());
        } else {
            throw new ResourceNotFoundException("Record not found with id: " + Id);
        }
	}

	@Override
	public DistributorProfile createDistributorProfile(DistributorProfile distributorProfile) {
	    if (distributorProfile.getAddress() == null || distributorProfile.getAddress().isEmpty()) {
	        throw new IllegalArgumentException("Address cannot be null or empty.");
	    }
	    if (distributorProfileRepository.existsByEmail(distributorProfile.getEmail())) {
	        throw new IllegalArgumentException("Distributor profile with the same email already exists.");
	    }
	    return distributorProfileRepository.save(distributorProfile);
	}


	@Override
	public DistributorProfile updateDistributorProfile(Long id, DistributorProfile updatedProfile) {
	    Optional<DistributorProfile> distributorProfileDb = distributorProfileRepository.findById(id);
	    if (distributorProfileDb.isPresent()) {
	        DistributorProfile distributorProfileToUpdate = distributorProfileDb.get();
	        if (updatedProfile.getAddress() != null && !updatedProfile.getAddress().isEmpty()) {
	            distributorProfileToUpdate.setAddress(updatedProfile.getAddress());
	        }

	        if (updatedProfile.getState() != null && !updatedProfile.getState().isEmpty()) {
	            distributorProfileToUpdate.setState(updatedProfile.getState());
	        }

	        if (updatedProfile.getAgencyName() != null && !updatedProfile.getAgencyName().isEmpty()) {
	            distributorProfileToUpdate.setAgencyName(updatedProfile.getAgencyName());
	        }

	        if (updatedProfile.getContactPerson() != null && !updatedProfile.getContactPerson().isEmpty()) {
	            distributorProfileToUpdate.setContactPerson(updatedProfile.getContactPerson());
	        }

	        if (updatedProfile.getContactNumber() != null && !updatedProfile.getContactNumber().isEmpty()) {
	            distributorProfileToUpdate.setContactNumber(updatedProfile.getContactNumber());
	        }

	        if (updatedProfile.getEmail() != null && !updatedProfile.getEmail().isEmpty()) {
	            distributorProfileToUpdate.setEmail(updatedProfile.getEmail());
	        }
	        distributorProfileToUpdate.setIsActive(updatedProfile.getIsActive() != null ? updatedProfile.getIsActive() : true);
	        return distributorProfileRepository.save(distributorProfileToUpdate);
	    } else {
	        throw new ResourceNotFoundException("Record not found with id: " + id);
	    }
	}

	@Override
	public Long countAllDistributorProfile() {
		return distributorProfileRepository.countAllDistributorProfile();
	}
}
