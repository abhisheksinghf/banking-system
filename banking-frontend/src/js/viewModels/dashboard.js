define(['../accUtils', 'knockout', 'ojs/ojarraydataprovider', 
        '../services/customerService', '../services/accountService',
        'ojs/ojtable', 'ojs/ojknockout'],
 function(accUtils, ko, ArrayDataProvider, customerService, accountService) {
    function DashboardViewModel() {
      let self = this;
      
      // KPI counts
      self.totalCustomers = ko.observable(0);
      self.totalAccounts = ko.observable(0);
      self.totalBalance = ko.observable("$0.00");
      self.avgBalance = ko.observable("$0.00");
      
      // Recent accounts table
      self.recentAccounts = ko.observableArray([]);
      self.dataProvider = new ArrayDataProvider(self.recentAccounts, { keyAttributes: 'accountNo' });
      
      // Format currency
      self.formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(amount);
      };
      
      // Load customers count
      self.loadCustomers = () => {
        customerService.listCustomers()
          .then(customers => {
            self.totalCustomers(customers.length);
          })
          .catch(err => {
            console.error("Error loading customers:", err);
            self.totalCustomers(0);
          });
      };
      
      // Load accounts and calculate metrics
      self.loadAccounts = () => {
        accountService.listAccounts()
          .then(accounts => {
            // Total accounts
            self.totalAccounts(accounts.length);
            
            // Calculate total balance
            const total = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
            self.totalBalance(self.formatCurrency(total));
            
            // Calculate average balance
            const avg = accounts.length > 0 ? total / accounts.length : 0;
            self.avgBalance(self.formatCurrency(avg));
            
            // Show recent accounts (last 5)
            const recentFive = accounts.slice(-5).reverse();
            self.recentAccounts(recentFive);
          })
          .catch(err => {
            console.error("Error loading accounts:", err);
            self.totalAccounts(0);
            self.totalBalance("$0.00");
            self.avgBalance("$0.00");
            self.recentAccounts([]);
          });
      };
      
      // Load all dashboard data
      self.loadDashboardData = () => {
        self.loadCustomers();
        self.loadAccounts();
      };
      
      // Lifecycle
      this.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
        self.loadDashboardData();
      };
      
      this.disconnected = () => {};
      
      this.transitionCompleted = () => {};
    }
    
    return DashboardViewModel;
  }
);