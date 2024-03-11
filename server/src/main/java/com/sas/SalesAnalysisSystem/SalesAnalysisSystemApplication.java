package com.sas.SalesAnalysisSystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class SalesAnalysisSystemApplication {

	public static void main(String[] args) {
		
		SpringApplication.run(SalesAnalysisSystemApplication.class, args);
		System.out.print("Hi Neha..");
	}

}
