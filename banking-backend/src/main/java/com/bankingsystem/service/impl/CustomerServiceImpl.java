package com.bankingsystem.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bankingsystem.dto.CustomerDTO;
import com.bankingsystem.entity.Customer;
import com.bankingsystem.exception.ResourceNotFoundException;
import com.bankingsystem.repository.CustomerRepository;
import com.bankingsystem.service.CustomerService;

@Service
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private CustomerRepository repository;

	private CustomerDTO toDTO(Customer c) {
		CustomerDTO d = new CustomerDTO();
		d.setId(c.getId());
		d.setName(c.getName());
		d.setEmail(c.getEmail());
		d.setMobileNumber(c.getMobileNumber());
		d.setAddress(c.getAddress());
		return d;
	}

	@Override
	public List<CustomerDTO> getAllCustomers() {
	    return repository.findAll()
	            .stream()
	            .map(this::toDTO)
	            .collect(Collectors.toList());
	}
	
	private Customer toEntity(CustomerDTO d) {
		Customer c = new Customer();
		c.setName(d.getName());
		c.setEmail(d.getEmail());
		c.setMobileNumber(d.getMobileNumber());
		c.setAddress(d.getAddress());
		return c;
	}

	@Override
	public CustomerDTO createCustomer(CustomerDTO dto) {
		Customer c = toEntity(dto);
		Customer saved = repository.save(c);
		return toDTO(saved);
	}

	@Override
	public CustomerDTO getCustomer(Long id) {
		Customer c = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
		return toDTO(c);
	}

	@Override
	public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {
		Customer existing = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
		existing.setName(dto.getName());
		existing.setEmail(dto.getEmail());
		existing.setMobileNumber(dto.getMobileNumber());
		existing.setAddress(dto.getAddress());
		return toDTO(repository.save(existing));
	}
}
