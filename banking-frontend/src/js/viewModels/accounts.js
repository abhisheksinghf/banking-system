define([
  'knockout',
  'ojs/ojarraydataprovider',
  'services/accountService',
  'services/customerService',
  'ojs/ojknockout',
  'ojs/ojtable',
  'ojs/ojbutton',
  'oj-c/select-single',
  'ojs/ojinputnumber',
  'ojs/ojinputtext',
  'ojs/ojformlayout',
  'ojs/ojdialog',
], function (ko, ArrayDataProvider, accountService, customerService) {
  function AccountsViewModel() {
    const self = this;
    
    // Accounts Table
    self.accounts = ko.observableArray([]);
    self.dataProvider = new ArrayDataProvider(self.accounts, { keyAttributes: 'accountNo' });
    
    // Customers for dropdown
    self.customers = ko.observableArray([]);
    self.customersDP = ko.computed(() => new ArrayDataProvider(self.customers(), { keyAttributes: 'id' }));
    
    // Account Types for dropdown
    self.accountTypes = [
      { value: 'Saving', label: 'Saving' },
      { value: 'Current', label: 'Current' }
    ];
    self.accountTypesDP = new ArrayDataProvider(self.accountTypes, { keyAttributes: 'value' });
    
    // Add Account form fields
    self.newAccountHolderId = ko.observable();
    self.newAccountBalance = ko.observable();
    self.newAccountType = ko.observable();
    
    // Edit Account form fields
    self.editAccountNo = ko.observable();
    self.editAccountHolderName = ko.observable();
    self.editAccountBalance = ko.observable();
    self.editAccountType = ko.observable();
    
    // Search field
    self.searchAccountNo = ko.observable("");
    
    // Load all accounts
    self.loadAccounts = () => {
      console.log("Loading all accounts...");
      accountService.listAccounts()
        .then(data => {
          console.log("Accounts loaded:", data);
          self.accounts(data);
        })
        .catch(err => {
          console.error("Error fetching accounts:", err);
          self.accounts([]);
        });
    };
    
    // Search account by Account No
    self.searchAccount = () => {
      const accountNo = self.searchAccountNo();
      console.log("Searching for account:", accountNo);
      
      if (!accountNo) {
        self.loadAccounts();
        return;
      }
      
      accountService.getAccount(accountNo)
        .then(account => {
          console.log("Account found:", account);
          self.accounts([account]);
        })
        .catch(err => {
          console.error("Error searching account:", err);
          alert("Account not found with Account No " + accountNo);
          self.accounts([]);
        });
    };
    
    // Load customers for dropdown
    self.loadCustomers = () => {
      console.log("Loading customers...");
      customerService.listCustomers()
        .then(data => {
          console.log("Customers loaded:", data);
          self.customers(data);
        })
        .catch(err => {
          console.error("Error fetching customers:", err);
          self.customers([]);
        });
    };
    
    // Add Dialog handling
    self.openAddDialog = () => {
      console.log("Opening Add Account dialog");
      self.loadCustomers();
      // Reset form fields
      self.newAccountHolderId(null);
      self.newAccountBalance(null);
      self.newAccountType(null);
      document.getElementById('addAccountDialog').open();
    };
    
    self.closeAddDialog = () => {
      console.log("Closing Add Account dialog");
      document.getElementById('addAccountDialog').close();
    };
    
    // Save new account
    self.saveAccount = () => {
      console.log("Saving new account...");
      
      if (!self.newAccountHolderId() || !self.newAccountBalance() || !self.newAccountType()) {
        console.log("Validation failed: All fields are required");
        alert("All fields are required!");
        return;
      }
      
      const selectedCustomer = self.customers().find(c => c.id === self.newAccountHolderId());
      const newAcc = {
        accountHolderName: selectedCustomer.name,
        balance: self.newAccountBalance(),
        accountType: self.newAccountType()
      };
      
      console.log("Creating account:", newAcc);
      
      accountService.createAccount(newAcc)
        .then(data => {
          console.log("Account created successfully:", data);
          self.accounts.push(data);
          self.closeAddDialog();
          alert("Account added successfully!");
        })
        .catch(err => {
          console.error("Error adding account:", err);
          alert("Error adding account: " + err.message);
        });
    };
    
    // Edit Dialog handling
    self.openEditDialog = (accountData) => {
      console.log("Opening Edit dialog for account:", accountData);
      
      // Populate form fields with existing account data
      self.editAccountNo(accountData.accountNo);
      self.editAccountHolderName(accountData.accountHolderName);
      self.editAccountBalance(accountData.balance);
      self.editAccountType(accountData.accountType);
      
      document.getElementById("editAccountDialog").open();
    };
    
    self.closeEditDialog = () => {
      console.log("Closing Edit Account dialog");
      document.getElementById("editAccountDialog").close();
    };
    
    // Update existing account via API
    self.updateAccount = () => {
      const accountNo = self.editAccountNo();
      const updatedAccount = {
        accountNo: accountNo,
        accountHolderName: self.editAccountHolderName(),
        balance: self.editAccountBalance(),
        accountType: self.editAccountType()
      };
      
      console.log("Updating account:", updatedAccount);
      
      accountService.updateAccount(accountNo, updatedAccount)
        .then(updatedData => {
          console.log("Account updated successfully:", updatedData);
          
          // Update the account in the array
          const accounts = self.accounts();
          const index = accounts.findIndex(acc => acc.accountNo === accountNo);
          if (index !== -1) {
            accounts[index] = updatedData;
            self.accounts.valueHasMutated(); // Notify observers
          }
          self.closeEditDialog();
          alert("Account updated successfully!");
        })
        .catch(err => {
          console.error("Error updating account:", err);
          alert("Failed to update account. Please try again.");
        });
    };
    
    // Delete account with simple confirm
// Delete account with simple confirm
self.confirmDelete = (accountData) => {
  console.log("Delete requested for account:", accountData);
  
  const confirmMsg = `Are you sure you want to delete account ${accountData.accountNo} (${accountData.accountHolderName})?`;
  
  if (confirm(confirmMsg)) {
    console.log("User confirmed delete");
    const accountNo = accountData.accountNo;
    
    accountService.deleteAccount(accountNo)
      .then(() => {
        console.log("Account deleted successfully:", accountNo);
        
        // Remove using Knockout's remove method
        self.accounts.remove(function(item) {
          return item.accountNo === accountNo;
        });
        
        alert("Account deleted successfully!");
      })
      .catch(err => {
        console.error("Error deleting account:", err);
        alert("Failed to delete account. Please try again.");
      });
  } else {
    console.log("Delete cancelled by user");
  }
};
    
    // Lifecycle
    self.connected = () => {
      console.log("AccountsViewModel connected");
      self.loadAccounts();
    };
  }
  
  return AccountsViewModel;
});