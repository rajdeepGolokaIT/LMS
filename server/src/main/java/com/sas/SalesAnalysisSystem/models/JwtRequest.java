package com.sas.SalesAnalysisSystem.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

public class JwtRequest {
	
	private String username;
	private String email;
	private String password;
	
	public JwtRequest(String username,String email, String password) {
		this.username = username;
		this.email = email;
		this.password = password;
	}
	
	// Getter and Setter methods
	
	public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.email = username;
    }
	
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Builder pattern
    public static JwtRequestBuilder builder() {
        return new JwtRequestBuilder();
    }

    // Inner Builder class
    public static class JwtRequestBuilder {
    	private String username;
        private String email;
        private String password;

        JwtRequestBuilder() {}

        public JwtRequestBuilder username(String username) {
            this.username = username;
            return this;
        }

        public JwtRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public JwtRequest build() {
            return new JwtRequest(username,email,password);
        }
    }

    // ToString method
    @Override
    public String toString() {
        return "JwtRequest{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
	
}
