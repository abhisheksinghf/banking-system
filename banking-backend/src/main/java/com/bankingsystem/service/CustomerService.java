package com.bankingsystem.service;

import java.util.List;

import com.bankingsystem.dto.CustomerDTO;

public interface CustomerService {
	CustomerDTO createCustomer(CustomerDTO dto);

	CustomerDTO getCustomer(Long id);

	CustomerDTO updateCustomer(Long id, CustomerDTO dto);
	
	List<CustomerDTO> getAllCustomers(); 
}
