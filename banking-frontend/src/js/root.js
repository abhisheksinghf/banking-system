require(['ojs/ojbootstrap', 'knockout', './appController', 'ojs/ojknockout',
         'ojs/ojmodule', 'ojs/ojrouter', 'ojs/ojnavigationlist', 'ojs/ojbutton', 'ojs/ojtoolbar'],
function (Bootstrap, ko, app) {
    Bootstrap.whenDocumentReady().then(function() {
        function init() {
            ko.applyBindings(app, document.getElementById('globalBody'));
        }
        if (document.body.classList.contains('oj-hybrid')) {
            document.addEventListener("deviceready", init);
        } else {
            init();
        }
    });
});
