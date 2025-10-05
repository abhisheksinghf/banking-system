package com.bankingsystem.service.impl;

import com.bankingsystem.dto.AccountDTO;
import com.bankingsystem.dto.CustomerDTO;
import com.bankingsystem.entity.Account;
import com.bankingsystem.exception.ResourceNotFoundException;
import com.bankingsystem.repository.AccountRepository;
import com.bankingsystem.service.AccountService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {

	@Autowired
	private AccountRepository repository;

	private AccountDTO toDTO(Account a) {
		AccountDTO d = new AccountDTO();
		d.setAccountNo(a.getAccountNo());
		d.setAccountHolderName(a.getAccountHolderName());
		d.setBalance(a.getBalance());
		d.setAccountType(a.getAccountType());
		return d;
	}

	private Account toEntity(AccountDTO d) {
		Account a = new Account();
		a.setAccountHolderName(d.getAccountHolderName());
		a.setBalance(d.getBalance());
		a.setAccountType(d.getAccountType());
		return a;
	}

	@Override
	public List<AccountDTO> getAllAccounts() {
	    return repository.findAll()
	            .stream()
	            .map(this::toDTO)
	            .collect(Collectors.toList());
	}
	
	@Override
	public AccountDTO createAccount(AccountDTO dto) {
		Account account = toEntity(dto);
		Account saved = repository.save(account);
		return toDTO(saved);
	}

	@Override
	public AccountDTO getAccount(Long accountNo) {
		Account a = repository.findById(accountNo)
				.orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountNo));
		return toDTO(a);
	}

	@Override
	public void deleteAccount(Long accountNo) {
		Account a = repository.findById(accountNo)
				.orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountNo));
		repository.delete(a);
	}

	@Override
	public AccountDTO updateAccount(Long accountNo, AccountDTO dto) {
		Account a = repository.findById(accountNo)
				.orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountNo));
		// Update allowed fields
		if (dto.getAccountHolderName() != null) {
			a.setAccountHolderName(dto.getAccountHolderName());
		}
		if (dto.getBalance() != null) {
			a.setBalance(dto.getBalance());
		}
		if (dto.getAccountType() != null) {
			a.setAccountType(dto.getAccountType());
		}
		Account saved = repository.save(a);
		return toDTO(saved);
	}
}
