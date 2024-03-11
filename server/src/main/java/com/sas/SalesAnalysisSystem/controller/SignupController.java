package com.sas.SalesAnalysisSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sas.SalesAnalysisSystem.models.User;
import com.sas.SalesAnalysisSystem.repository.UserRepository;

@Controller
@RequestMapping(path="/Signup")

public class SignupController {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@PostMapping(path="/adduser") // Map ONLY POST Requests
	  public @ResponseBody HttpStatus addNewUser (@RequestParam String username
	      , @RequestParam String email, @RequestParam String password) {
		
		User existingUser = userRepository.findByUsername(username);
	    if (existingUser != null) {
	    	return HttpStatus.NOT_ACCEPTABLE;
	    }
		
		String encodedPassword = bCryptPasswordEncoder.encode(password);
		
	    User n = new User(username, email, encodedPassword);
	    userRepository.save(n);
	    return HttpStatus.CREATED;
	  }
	
	@GetMapping(path="/all")
	  public @ResponseBody Iterable<User> getAllUsers() {
	    // This returns a JSON or XML with the users
	    return userRepository.findAll();
	  }

}
