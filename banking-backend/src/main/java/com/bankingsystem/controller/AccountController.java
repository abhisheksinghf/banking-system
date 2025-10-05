package com.bankingsystem.controller;

import com.bankingsystem.dto.AccountDTO;
import com.bankingsystem.dto.CustomerDTO;
import com.bankingsystem.service.AccountService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
@CrossOrigin(origins = "http://localhost:8000")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

	@Autowired
	private AccountService service;

	@PostMapping
	public ResponseEntity<AccountDTO> create(@Valid @RequestBody AccountDTO dto) {
		return ResponseEntity.status(201).body(service.createAccount(dto));
	}
	
	@GetMapping
	public ResponseEntity<List<AccountDTO>> getAll() {
	    return ResponseEntity.ok(service.getAllAccounts());
	}
	

	@GetMapping("/{accountNo}")
	public ResponseEntity<AccountDTO> get(@PathVariable Long accountNo) {
		return ResponseEntity.ok(service.getAccount(accountNo));
	}
	
	@DeleteMapping("/{accountNo}")
	public ResponseEntity<Void> delete(@PathVariable Long accountNo) {
		service.deleteAccount(accountNo);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{accountNo}")
	public ResponseEntity<AccountDTO> update(@PathVariable Long accountNo, @Valid @RequestBody AccountDTO dto) {
		AccountDTO updated = service.updateAccount(accountNo, dto);
		return ResponseEntity.ok(updated);
	}
}
