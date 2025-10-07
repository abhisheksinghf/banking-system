define(['../accUtils', 'knockout', 'ojs/ojarraydataprovider',
        '../services/dashboardService',
        'ojs/ojtable', 'ojs/ojknockout', 'ojs/ojchart'],
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
     
      // Pie chart data - each account type is a separate series
      self.pieSeriesValue = ko.observableArray([]);
      self.pieGroupsValue = ko.observableArray(['Account Types']); // Single group for pie chart
     
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
           
            // Format pie chart data - each account type becomes a series
            console.log("Account Type Data:", data.accountTypeData);
            
            if (data.accountTypeData && data.accountTypeData.length > 0) {
              // Each account type is a separate series with one item
              const series = data.accountTypeData.map(item => ({
                name: item.name,
                items: [item.value]
              }));
              
              self.pieSeriesValue(series);
              
              console.log("Pie Series:", self.pieSeriesValue());
              console.log("Pie Groups:", self.pieGroupsValue());
            } else {
              self.pieSeriesValue([]);
            }
          })
          .catch(err => {
            console.error("Error loading dashboard data:", err);
            // Reset to default values on error
            self.totalCustomers(0);
            self.totalAccounts(0);
            self.totalBalance("$0.00");
            self.avgBalance("$0.00");
            self.recentAccounts([]);
            self.pieSeriesValue([]);
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