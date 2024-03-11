package com.sas.SalesAnalysisSystem.service;

import com.sas.SalesAnalysisSystem.models.Salesperson;

import java.util.List;

public interface SalespersonService {

    Salesperson getSalespersonById(Long salespersonId);

    List<Salesperson> getAllSalespersons();

    void deleteSalesperson(Long salespersonId);

    Salesperson createSalesperson(Salesperson salesperson);

    Salesperson updateSalesperson(Long id, Salesperson salesperson);
}
