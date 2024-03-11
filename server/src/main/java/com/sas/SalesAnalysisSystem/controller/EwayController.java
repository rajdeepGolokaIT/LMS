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
import com.sas.SalesAnalysisSystem.models.Eway;
import com.sas.SalesAnalysisSystem.service.EwayService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/eways")
public class EwayController {
	    @Autowired
	    private EwayService ewayService;

	    @GetMapping("/all")
	    public ResponseEntity<Object> getAllEways() {
	        try {
	            List<Eway> eways = ewayService.getAllEways();
	            return ResponseEntity.ok().body(eways);
	        } catch (ResourceNotFoundException e) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Eways found");
	        }
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<Object> getEwayById(@PathVariable("id") Long id) {
	        try {
	            Eway eway = ewayService.getEwayById(id);
	            return ResponseEntity.ok().body(eway);
	        } catch (ResourceNotFoundException e) {
	            CustomErrorResponse errorResponse = new CustomErrorResponse();
	            errorResponse.setTimestamp(LocalDateTime.now());
	            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
	            errorResponse.setError("No Eway Found for this id - " + id);
	            errorResponse.setMessage(e.getMessage());
	            errorResponse.setPath("/api/v1/eways/all/" + id);
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
	        }
	    }

	    @PostMapping("/add-eway")
	    public ResponseEntity<Eway> createEway(@Valid @RequestBody Eway eway) {
	        Eway createdEway = ewayService.createEway(eway);
	        return new ResponseEntity<>(createdEway, HttpStatus.CREATED);
	    }

	    @PutMapping("update-eway/{id}")
	    public ResponseEntity<Object> updateEway(@PathVariable("id") Long id, @Valid @RequestBody Eway eway) {
	        try {
	            Eway updatedEway = ewayService.updateEway(id, eway);
	            return ResponseEntity.ok().body(updatedEway);
	        } catch (ResourceNotFoundException e) {
	            CustomErrorResponse errorResponse = new CustomErrorResponse();
	            errorResponse.setTimestamp(LocalDateTime.now());
	            errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
	            errorResponse.setError("No Eway Found for this id - " + id);
	            errorResponse.setMessage(e.getMessage());
	            errorResponse.setPath("/api/v1/eways/all/" + id);
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
	        }
	    }

	    @DeleteMapping("/delete-eway")
	    public ResponseEntity<Object> deleteEway(@RequestParam("id") Long id) {
	        try {
	            ewayService.deleteEway(id);
	            return ResponseEntity.ok("Eway successfully deleted.");
	        } catch (ResourceNotFoundException e) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Eway not found with id: " + id);
	        }
	    }
	}
