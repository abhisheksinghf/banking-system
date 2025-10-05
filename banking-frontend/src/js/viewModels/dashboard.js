define(['../accUtils', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojtable', 'ojs/ojknockout'],
 function(accUtils, ko, ArrayDataProvider) {
    function DashboardViewModel() {
      let self = this;

      // KPI counts
      self.totalCustomers = ko.observable(120);
      self.totalOrders = ko.observable(85);
      self.totalRevenue = ko.observable("$25K");
      self.totalTickets = ko.observable(14);

      // Dummy table data
      let tableData = [
        { id: 1, name: "John Doe", status: "Active", amount: "$1200" },
        { id: 2, name: "Jane Smith", status: "Pending", amount: "$450" },
        { id: 3, name: "Robert Brown", status: "Inactive", amount: "$0" },
        { id: 4, name: "Emily Johnson", status: "Active", amount: "$980" },
        { id: 5, name: "Michael Davis", status: "Pending", amount: "$300" }
      ];

      self.dataProvider = new ArrayDataProvider(tableData, { keyAttributes: 'id' });

      // Lifecycle
      this.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
      };
      this.disconnected = () => {};
      this.transitionCompleted = () => {};
    }
    return DashboardViewModel;
  }
);
