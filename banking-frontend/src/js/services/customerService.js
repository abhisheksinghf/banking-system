define([], function () {
  const BASE_URL = "http://localhost:5000/api/customers";
  
  function handleResponse(response) {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text); });
    }
    return response.json();
  }
  
  return {
    // Get all customers
    listCustomers: () => {
      return fetch(BASE_URL).then(handleResponse);
    },
    
    // Create new customer
    createCustomer: (customer) => {
      return fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
      }).then(handleResponse);
    },
    
    // Get customer by ID
    getCustomerById: (id) => {
      return fetch(`${BASE_URL}/${id}`).then(handleResponse);
    },
    
    // Update existing customer
    updateCustomer: (id, customer) => {
      return fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
      }).then(handleResponse);
    }
  };
});