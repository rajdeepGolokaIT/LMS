package com.sas.SalesAnalysisSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sas.SalesAnalysisSystem.models.Salesperson;


public interface SalespersonRepository extends JpaRepository<Salesperson, Long> {

	boolean existsByName(String name);
}
