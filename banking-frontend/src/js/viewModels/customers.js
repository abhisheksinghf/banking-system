define(['../accUtils', 'knockout', 'ojs/ojarraydataprovider',
        'services/customerService',
        'ojs/ojtable', 'ojs/ojknockout', 'ojs/ojdialog',
        'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojbutton'],
 function(accUtils, ko, ArrayDataProvider, customerService) {
    function CustomerViewModel() {
      let self = this;
      
      self.customers = ko.observableArray([]);
      self.dataProvider = new ArrayDataProvider(self.customers, { keyAttributes: 'id' });
      
      // Add Customer Form fields
      self.newCustomerName = ko.observable("");
      self.newCustomerEmail = ko.observable("");
      self.newCustomerMobile = ko.observable("");
      self.newCustomerAddress = ko.observable("");
      
      // Edit Customer Form fields
      self.editCustomerId = ko.observable("");
      self.editCustomerName = ko.observable("");
      self.editCustomerEmail = ko.observable("");
      self.editCustomerMobile = ko.observable("");
      self.editCustomerAddress = ko.observable("");
      
      // Search field
      self.searchCustomerId = ko.observable("");
      
      // Load all customers
      self.loadCustomers = () => {
        customerService.listCustomers()
          .then(data => self.customers(data))
          .catch(err => console.error("Error loading customers:", err));
      };
      
      // Search by ID
      self.searchCustomer = () => {
        const id = self.searchCustomerId();
        if (!id) {
          self.loadCustomers();
          return;
        }
        customerService.getCustomerById(id)
          .then(cust => {
            self.customers([cust]);
          })
          .catch(err => {
            console.error("Error searching customer:", err);
            alert("Customer not found with ID " + id);
            self.customers([]);
          });
      };
      
      // Add Dialog handling
      self.openAddDialog = () => {
        // Reset form fields
        self.newCustomerName("");
        self.newCustomerEmail("");
        self.newCustomerMobile("");
        self.newCustomerAddress("");
        document.getElementById("addCustomerDialog").open();
      };
      
      self.closeAddDialog = () => {
        document.getElementById("addCustomerDialog").close();
      };
      
      // Save new customer via API
      self.saveCustomer = () => {
        const newCust = {
          name: self.newCustomerName(),
          email: self.newCustomerEmail(),
          mobileNumber: self.newCustomerMobile(),
          address: self.newCustomerAddress()
        };
        
        customerService.createCustomer(newCust)
          .then(savedCustomer => {
            self.customers.push(savedCustomer);
            self.closeAddDialog();
          })
          .catch(err => {
            console.error("Error saving customer:", err);
            alert("Failed to add customer. Please try again.");
          });
      };
      
      // Edit Dialog handling
      self.openEditDialog = (customerData) => {
        // Populate form fields with existing customer data
        self.editCustomerId(customerData.id);
        self.editCustomerName(customerData.name);
        self.editCustomerEmail(customerData.email);
        self.editCustomerMobile(customerData.mobileNumber);
        self.editCustomerAddress(customerData.address);
        
        document.getElementById("editCustomerDialog").open();
      };
      
      self.closeEditDialog = () => {
        document.getElementById("editCustomerDialog").close();
      };
      
      // Update existing customer via API
      self.updateCustomer = () => {
        const customerId = self.editCustomerId();
        const updatedCustomer = {
          id: customerId,
          name: self.editCustomerName(),
          email: self.editCustomerEmail(),
          mobileNumber: self.editCustomerMobile(),
          address: self.editCustomerAddress()
        };
        
        customerService.updateCustomer(customerId, updatedCustomer)
          .then(updatedData => {
            // Update the customer in the array
            const customers = self.customers();
            const index = customers.findIndex(c => c.id === customerId);
            if (index !== -1) {
              customers[index] = updatedData;
              self.customers.valueHasMutated(); // Notify observers
            }
            self.closeEditDialog();
            alert("Customer updated successfully!");
          })
          .catch(err => {
            console.error("Error updating customer:", err);
            alert("Failed to update customer. Please try again.");
          });
      };
      
      // Lifecycle
      this.connected = () => {
        accUtils.announce('Customers page loaded.', 'assertive');
        document.title = "Customers";
        self.loadCustomers();
      };
    }
    
    return CustomerViewModel;
});