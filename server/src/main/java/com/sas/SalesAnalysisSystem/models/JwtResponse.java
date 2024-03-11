package com.sas.SalesAnalysisSystem.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

public class JwtResponse {
	
	private String jwtToken;
	private String username;
	
	public JwtResponse(String jwtToken, String username) {
		this.jwtToken = jwtToken;
		this.username = username;
	}
	
	// Getter and Setter methods
    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    
    // Builder pattern
    public static JwtResponseBuilder builder() {
        return new JwtResponseBuilder();
    }

    // Inner Builder class
    public static class JwtResponseBuilder {
        private String jwtToken;
        private String username;

        JwtResponseBuilder() {}

        public JwtResponseBuilder jwtToken(String jwtToken) {
            this.jwtToken = jwtToken;
            return this;
        }

        public JwtResponseBuilder username(String username) {
            this.username = username;
            return this;
        }
        
        public JwtResponse build() {
            return new JwtResponse(jwtToken, username);
        }
    }

    // ToString method
    @Override
    public String toString() {
        return "JwtResponse{" +
                "jwtToken='" + jwtToken + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
	
}
