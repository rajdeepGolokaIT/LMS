package com.sas.SalesAnalysisSystem.service;

import java.util.List;

import com.sas.SalesAnalysisSystem.models.DistributorProfile;

public interface DistributorProfileService {
	
	 DistributorProfile getDistributorProfileById(Long Id);

	    List<DistributorProfile> getAllDistributorProfile();

	    void deleteDistributorProfile(Long Id);

	    DistributorProfile createDistributorProfile(DistributorProfile category);

	    DistributorProfile updateDistributorProfile(Long id, DistributorProfile category);

		Long countAllDistributorProfile();
	    
	    

}
