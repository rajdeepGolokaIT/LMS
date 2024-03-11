package com.sas.SalesAnalysisSystem.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer userid;
    private String username;
    private String email;
    private String password;
    //private String role;
    
	public User(String name, String email, String password) {
		this.username = name;
		this.email = email;
		this.password = password;
		//this.role = role;
	}
	
	public User() {
		
	}
	public void setName(String name) {
		this.username = name;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUsername() {
		return this.username;
	}
	public String getEmail() {
		return this.email;
	}
	public String getPassword() {
		return this.password;
	}
//	public String getRole() {
//		return role;
//	}
//	public void setRole(String role) {
//		this.role = role;
//	}
}
