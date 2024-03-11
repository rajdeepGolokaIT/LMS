package com.sas.SalesAnalysisSystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.sas.SalesAnalysisSystem.models.Distributor;


public interface DistributorRepository extends JpaRepository<Distributor, Long>{
}
