define(['./customerService', './accountService'], function (customerService, accountService) {
  
  /**
   * Format number as USD currency
   */
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }
  
  /**
   * Calculate dashboard metrics from accounts data
   */
  function calculateMetrics(accounts) {
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const avgBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0;
    
    return {
      totalAccounts,
      totalBalance: formatCurrency(totalBalance),
      avgBalance: formatCurrency(avgBalance)
    };
  }
  
  /**
   * Get recent accounts (last 5, newest first)
   */
  function getRecentAccounts(accounts) {
    return accounts.slice(-5).reverse();
  }
  
  /**
   * Calculate account type distribution for pie chart
   */
  function getAccountTypeDistribution(accounts) {
    const distribution = accounts.reduce((acc, account) => {
      const type = account.accountType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array format for chart
    return Object.keys(distribution).map(type => ({
      name: type,
      value: distribution[type]
    }));
  }
  
  return {
    /**
     * Fetch dashboard data including customers count and account metrics
     * @returns {Promise<Object>} Dashboard data with all KPIs
     */
    getDashboardData: async () => {
      try {
        // Fetch both customers and accounts in parallel
        const [customers, accounts] = await Promise.all([
          customerService.listCustomers(),
          accountService.listAccounts()
        ]);
        
        const metrics = calculateMetrics(accounts);
        const recentAccounts = getRecentAccounts(accounts);
        const accountTypeData = getAccountTypeDistribution(accounts);
        
        return {
          totalCustomers: customers.length,
          totalAccounts: metrics.totalAccounts,
          totalBalance: metrics.totalBalance,
          avgBalance: metrics.avgBalance,
          recentAccounts: recentAccounts,
          accountTypeData: accountTypeData
        };
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
      }
    },
    
    /**
     * Fetch only customer count
     * @returns {Promise<number>} Number of customers
     */
    getCustomerCount: async () => {
      try {
        const customers = await customerService.listCustomers();
        return customers.length;
      } catch (error) {
        console.error("Error fetching customer count:", error);
        throw error;
      }
    },
    
    /**
     * Fetch account metrics only
     * @returns {Promise<Object>} Account metrics
     */
    getAccountMetrics: async () => {
      try {
        const accounts = await accountService.listAccounts();
        const metrics = calculateMetrics(accounts);
        const recentAccounts = getRecentAccounts(accounts);
        
        return {
          ...metrics,
          recentAccounts
        };
      } catch (error) {
        console.error("Error fetching account metrics:", error);
        throw error;
      }
    }
  };
});