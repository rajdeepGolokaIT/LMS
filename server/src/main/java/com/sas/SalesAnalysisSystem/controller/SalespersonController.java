package com.sas.SalesAnalysisSystem.controller;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sas.SalesAnalysisSystem.exception.CustomErrorResponse;
import com.sas.SalesAnalysisSystem.exception.ResourceNotFoundException;
import com.sas.SalesAnalysisSystem.models.Salesperson;
import com.sas.SalesAnalysisSystem.service.SalespersonService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/salespersons")
public class SalespersonController {

    @Autowired
    private SalespersonService salespersonService;

    @GetMapping("/all")
    public ResponseEntity<Object> getAllSalespersons() {
        try {
            List<Salesperson> salespersons = salespersonService.getAllSalespersons();
            return ResponseEntity.ok().body(salespersons);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No salespersons found");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getSalespersonById(@PathVariable("id") Long id) {
        try {
            Salesperson salesperson = salespersonService.getSalespersonById(id);
            return ResponseEntity.ok().body(salesperson);
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No salesperson Found for this id - " + id);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/salespersons/all/" + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @PostMapping("/add-salesperson")
    public ResponseEntity<Salesperson> createSalesperson(@Valid @RequestBody Salesperson salesperson) {
        Salesperson createdSalesperson = salespersonService.createSalesperson(salesperson);
        return new ResponseEntity<>(createdSalesperson, HttpStatus.CREATED);
    }

    @PutMapping("/update-salesperson/{id}")
    public ResponseEntity<Object> updateSalesperson(@PathVariable("id") Long id, @Valid @RequestBody Salesperson salesperson) {
        try {
            Salesperson updatedSalesperson = salespersonService.updateSalesperson(id, salesperson);
            return ResponseEntity.ok().body(updatedSalesperson);
        } catch (ResourceNotFoundException e) {
            CustomErrorResponse errorResponse = new CustomErrorResponse();
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
            errorResponse.setError("No salesperson Found for this id - " + id);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setPath("/api/v1/salespersons/all/" + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @DeleteMapping("/delete-salesperson")
    public ResponseEntity<Object> deleteSalesperson(@RequestParam("id") Long id) {
        try {
            salespersonService.deleteSalesperson(id);
            return ResponseEntity.ok("Salesperson successfully deleted.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Salesperson not found with id: " + id);
        }
    }
}

