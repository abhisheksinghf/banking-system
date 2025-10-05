package com.bankingsystem.service;

import java.util.List;

import com.bankingsystem.dto.AccountDTO;

public interface AccountService {
	AccountDTO createAccount(AccountDTO dto);

	AccountDTO getAccount(Long accountNo);

	void deleteAccount(Long accountNo);

	AccountDTO updateAccount(Long accountNo, AccountDTO dto);

	List<AccountDTO> getAllAccounts(); 
}
