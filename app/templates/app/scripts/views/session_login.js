var Marionette = require('backbone.marionette');
var LoginTmpl = require('../../templates/session_login');
var md5 = require('blueimp-md5').md5;
var handleErrorResponse = require('../lib/handleErrorResponse');
var Backbone = require('backbone');

/* Return a ItemView class definition */
module.exports = Marionette.ItemView.extend({

    initialize: function(options) {
        console.log("initialize a Login ItemView");
        this.options = options || {};
        this.options.redirectPath = this.options.redirectPath || '#session';
    },

    template: LoginTmpl,

    /* ui selector cache */
    ui: {
        loginButton: '#btn-login',
        accountInput: '#input-email',
        pwdInput: '#input-password',
        loginForm: '#form-login'
    },

    /* Ui events hash */
    events: {
        "click @ui.loginButton": "login",
        'change input': 'hideError'
    },

    /* on render callback */
    onRender: function() {},

    login: function() {
        var that = this;
        var creds = this.ui.loginForm.serializeObject();

        if (!creds.email) {
            this.showError({
                message: 'Empty email address.',
                path: 'email'
            });
            return false;
        }
        if (!creds.password) {
            this.showError({
                message: 'Empty password.',
                path: 'password'
            });
            return false;
        }

        creds.password = md5(creds.password);
        creds.isCrypted = true;
        creds.action = 'login';

        this.model.save(creds).then(
            function(model, resp) {
                var redirectPath = that.model.redirect || '#';
                delete that.model.redirect; // delete the redirect path once it is used.
                console.log('redirect to ' + (that.model.redirect || '#'));
                Backbone.history.navigate(redirectPath, true);
            }, 
            function(resp) {
                console.log('errors');
            }
        );

        return false;
    },

    hideError: function(e) {
        $(e.target).parent().popover('destroy');
    },

    showError: function(error) {
        if (error.path == 'password') {
            this.ui.pwdInput.popover({
                placement: 'left',
                content: error.message
            });
            this.ui.pwdInput.popover('show');
            this.ui.pwdInput.focus();
        }

        if (error.path == 'email') {
            this.ui.accountInput.popover({
                placement: 'left',
                content: error.message
            });
            this.ui.accountInput.popover('show');
            this.ui.accountInput.focus();
        }
    }
}); // end of Return a ItemView class definition
