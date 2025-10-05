package com.bankingsystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankingsystem.dto.CustomerDTO;
import com.bankingsystem.service.CustomerService;

import jakarta.validation.Valid;
@CrossOrigin(origins = "http://localhost:8000")	
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

	@Autowired
	private CustomerService service;

	@PostMapping
	public ResponseEntity<CustomerDTO> create(@Valid @RequestBody CustomerDTO dto) {
		return ResponseEntity.status(201).body(service.createCustomer(dto));
	}

	@GetMapping
	public ResponseEntity<List<CustomerDTO>> getAll() {
	    return ResponseEntity.ok(service.getAllCustomers());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<CustomerDTO> get(@PathVariable Long id) {
		return ResponseEntity.ok(service.getCustomer(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<CustomerDTO> update(@PathVariable Long id, @Valid @RequestBody CustomerDTO dto) {
		return ResponseEntity.ok(service.updateCustomer(id, dto));
	}
}
