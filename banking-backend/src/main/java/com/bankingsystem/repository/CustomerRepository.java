package com.bankingsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankingsystem.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}