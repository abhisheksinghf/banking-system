/**
 * Login module
 */
define(['knockout', 'appController', 'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojmessages'],
  function(ko, app) {
    function LoginViewModel() {
      var self = this;

      // Form fields
      this.username = ko.observable('');
      this.password = ko.observable('');
      this.loginError = ko.observable('');
      this.isLoggingIn = ko.observable(false);

      // Messages for error display
      this.messagesDataprovider = ko.observableArray([]);

      // Handle login
      this.handleLogin = () => {
        self.loginError('');
        self.messagesDataprovider([]);
        
        const username = self.username().trim();
        const password = self.password().trim();

        // Validation
        if (!username || !password) {
          self.showError('Please enter both username and password');
          return;
        }

        self.isLoggingIn(true);

        // Simulate async login (you can replace with actual API call)
        setTimeout(() => {
          const success = app.login(username, password);
          
          if (!success) {
            self.showError('Invalid username or password. Use admin/admin123');
            self.password(''); // Clear password on failed attempt
          }
          
          self.isLoggingIn(false);
        }, 500);
      };

      // Show error message
      this.showError = (message) => {
        self.messagesDataprovider([{
          severity: 'error',
          summary: 'Login Failed',
          detail: message,
          autoTimeout: 5000
        }]);
        self.loginError(message);
      };

      // Handle Enter key press
      this.handleKeyPress = (data, event) => {
        if (event.keyCode === 13) {
          self.handleLogin();
          return false;
        }
        return true;
      };

      // Page lifecycle
      this.connected = () => {
        // Reset form when page loads
        self.username('');
        self.password('');
        self.loginError('');
        self.messagesDataprovider([]);
      };
    }

    return LoginViewModel;
  }
);