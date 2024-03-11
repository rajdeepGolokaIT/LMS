package com.sas.SalesAnalysisSystem.repository;

import com.sas.SalesAnalysisSystem.models.Distributor;
import com.sas.SalesAnalysisSystem.models.DistributorProfile;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistributorProfileRepository extends JpaRepository<DistributorProfile, Long> {

	boolean existsByEmail(String email);

	Long countAllDistributorProfile();

}
