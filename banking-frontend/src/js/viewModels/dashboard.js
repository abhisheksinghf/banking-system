define(['../accUtils', 'knockout', 'ojs/ojarraydataprovider',
        '../services/dashboardService',
        'ojs/ojtable', 'ojs/ojknockout'],
 function(accUtils, ko, ArrayDataProvider, dashboardService) {
    function DashboardViewModel() {
      let self = this;
      
      // KPI observables
      self.totalCustomers = ko.observable(0);
      self.totalAccounts = ko.observable(0);
      self.totalBalance = ko.observable("$0.00");
      self.avgBalance = ko.observable("$0.00");
      
      // Recent accounts table
      self.recentAccounts = ko.observableArray([]);
      self.dataProvider = new ArrayDataProvider(self.recentAccounts, { keyAttributes: 'accountNo' });
      
      /**
       * Load all dashboard data
       */
      self.loadDashboardData = () => {
        dashboardService.getDashboardData()
          .then(data => {
            self.totalCustomers(data.totalCustomers);
            self.totalAccounts(data.totalAccounts);
            self.totalBalance(data.totalBalance);
            self.avgBalance(data.avgBalance);
            self.recentAccounts(data.recentAccounts);
          })
          .catch(err => {
            console.error("Error loading dashboard data:", err);
            // Reset to default values on error
            self.totalCustomers(0);
            self.totalAccounts(0);
            self.totalBalance("$0.00");
            self.avgBalance("$0.00");
            self.recentAccounts([]);
          });
      };
      
      // Lifecycle hooks
      this.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
        self.loadDashboardData();
      };
      
      this.disconnected = () => {
        // Cleanup if needed
      };
      
      this.transitionCompleted = () => {
        // Post-transition logic if needed
      };
    }
    
    return DashboardViewModel;
  }
);