package com.sas.SalesAnalysisSystem.service;

import java.util.List;

import com.sas.SalesAnalysisSystem.models.Eway;

public interface EwayService {

	Eway createEway(Eway eway);

	Eway updateEway(Long id, Eway eway);

	List<Eway> getAllEways();

	Eway getEwayById(Long ewayId);

	void deleteEway(Long ewayId);

}
