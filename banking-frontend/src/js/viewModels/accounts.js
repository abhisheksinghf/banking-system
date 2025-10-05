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

    // Add Account form
    self.newAccountHolderId = ko.observable();
    self.newAccountBalance = ko.observable();
    self.newAccountType = ko.observable();

    // Load accounts
    self.loadAccounts = () => {
      accountService.listAccounts()
        .then(data => self.accounts(data))
        .catch(err => {
          console.error("Error fetching accounts:", err);
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

    // Dialog open/close
    self.openDialog = () => {
      self.loadCustomers();
      document.getElementById('addAccountDialog').open();
    };
    self.closeDialog = () => document.getElementById('addAccountDialog').close();

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
          self.closeDialog();
          self.newAccountHolderId(null);
          self.newAccountBalance(null);
          self.newAccountType(null);
          alert("Account added successfully!");
        })
        .catch(err => {
          console.error("Error adding account:", err);
          alert("Error adding account: " + err.message);
        });
    };

    self.connected = () => {
      self.loadAccounts();
    };
  }

  return AccountsViewModel;
});
