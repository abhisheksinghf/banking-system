define([], function () {
  const BASE_URL = "http://localhost:5000/api/accounts";
  
  function handleResponse(response) {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text); });
    }
    return response.json();
  }
  
  return {
    // Fetch all accounts
    listAccounts: () => {
      return fetch(BASE_URL).then(handleResponse);
    },
    
    // Fetch single account by accountNo
    getAccount: (accountNo) => {
      return fetch(`${BASE_URL}/${accountNo}`).then(handleResponse);
    },
    
    // Create new account
    createAccount: (account) => {
      return fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account)
      }).then(handleResponse);
    },
    
    // Update existing account
    updateAccount: (accountNo, account) => {
      return fetch(`${BASE_URL}/${accountNo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account)
      }).then(handleResponse);
    },
    
    // Delete account
    deleteAccount: (accountNo) => {
      return fetch(`${BASE_URL}/${accountNo}`, {
        method: "DELETE"
      }).then(handleResponse);
    }
  };
});