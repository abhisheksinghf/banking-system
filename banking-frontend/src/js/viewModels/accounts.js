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
      accountService.listAccounts()
        .then(data => self.accounts(data))
        .catch(err => {
          console.error("Error fetching accounts:", err);
          self.accounts([]);
        });
    };
    
    // Search account by Account No
    self.searchAccount = () => {
      const accountNo = self.searchAccountNo();
      if (!accountNo) {
        self.loadAccounts();
        return;
      }
      
      accountService.getAccount(accountNo)
        .then(account => {
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
      customerService.listCustomers()
        .then(data => {
          self.customers(data);
        })
        .catch(err => {
          console.error("Error fetching customers:", err);
          self.customers([]);
        });
    };
    
    // Add Dialog handling
    self.openAddDialog = () => {
      self.loadCustomers();
      // Reset form fields
      self.newAccountHolderId(null);
      self.newAccountBalance(null);
      self.newAccountType(null);
      document.getElementById('addAccountDialog').open();
    };
    
    self.closeAddDialog = () => {
      document.getElementById('addAccountDialog').close();
    };
    
    // Save new account
    self.saveAccount = () => {
      if (!self.newAccountHolderId() || !self.newAccountBalance() || !self.newAccountType()) {
        alert("All fields are required!");
        return;
      }
      
      const selectedCustomer = self.customers().find(c => c.id === self.newAccountHolderId());
      const newAcc = {
        accountHolderName: selectedCustomer.name,
        balance: self.newAccountBalance(),
        accountType: self.newAccountType()
      };
      
      accountService.createAccount(newAcc)
        .then(data => {
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
      // Populate form fields with existing account data
      self.editAccountNo(accountData.accountNo);
      self.editAccountHolderName(accountData.accountHolderName);
      self.editAccountBalance(accountData.balance);
      self.editAccountType(accountData.accountType);
      
      document.getElementById("editAccountDialog").open();
    };
    
    self.closeEditDialog = () => {
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
      
      accountService.updateAccount(accountNo, updatedAccount)
        .then(updatedData => {
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
    
    // Lifecycle
    self.connected = () => {
      self.loadAccounts();
    };
  }
  
  return AccountsViewModel;
});