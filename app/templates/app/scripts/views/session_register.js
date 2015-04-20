var Marionette = require('backbone.marionette');
var session = require('../models/session');
var RegisterTmpl = require('../../templates/session_register');
var AlertView = require('./alert');
var md5 = require('blueimp-md5').md5;
var User = require('../models/user');
var Model = require('backbone').Model;
var handleErrorResponse = require('../lib/handleErrorResponse');
var validationTool = require('../lib/validationTool');



/* Return SessionRegisterView class definition */
module.exports = Marionette.ItemView.extend({

    initialize: function() {
        console.log("initialize a Register ItemView");
    },

    template: RegisterTmpl,

    /* ui selector cache */
    ui: {
        registerButton: '#btn-register',
        registerForm: '#form-register',
        alertBlock: '#block-alert',
        codeButton: '#btn-code'
    },

    /* Ui events hash */
    events: {
        'click @ui.registerButton': 'register',
        'click @ui.codeButton': 'requestCode'
    },

    register: function() {
        var that = this;
        var creds = this.ui.registerForm.serializeObject();

        if (!creds.email || !validationTool.checkEmail(creds.email)) {
            this.showError({
                message: 'Invalid email address.',
                path: 'email'
            });
            return false;
        }

        if (!creds.code) {
            this.showError({
                message: 'Empty secure code.',
                path: 'code'
            });
            return false;
        }

        if (!creds.password || creds.password.length < 6) {
            this.showError({
                message: 'Invalid password.',
                path: 'password'
            });
            return false;
        }

        if (!creds.name) {
            this.showError({
                message: 'Invalid user name.',
                path: 'name'
            });
            return false;
        }

        creds.password = md5(creds.password);
        creds.isCrypted = true;

        this.model.save(creds).then(function(model, resp) {
            creds.action = 'login'; // login
            return session.save(creds);
        }).then(function(model, resp) {
            var redirectPath = session.redirect || '#';
            delete session.redirect; // delete the redirect path once it is used.
            console.log('redirect to ' + (session.redirect || 'home'));
            location.href = redirectPath;
        }, function(resp) {
            handleErrorResponse(resp, that.showError)
        });

        return false;
    },

    requestCode: function() {
        var that = this;
        var email = $("input[name='email']").val();

        if (!email || !validationTool.checkEmail(email)) {
            this.showError({
                message: 'Invalid email address.',
                path: 'email'
            });
            return false;
        }

        $.get("/api/users/secureCode", {
            email: email
        }, function(result) {
            var message = result.success ? 'Sent email successfully.' : 'Failed to send email, check your address.';
            var showFunc = result.success ? that.showMessage : that.showError;
            showFunc({
                message: message
            });
        });

        return false;
    },

    showError: function(err) {
        var m = new Model(err);
        m.set('type', 'danger');
        $('#block-alert').append(new AlertView({
            model: m
        }).render().el);
    },

    showMessage: function(message) {
        var m = new Model(message);
        m.set('type', 'success');
        $('#block-alert').append(new AlertView({
            model: m
        }).render().el);
    },

    /* on render callback */
    onRender: function() {}
});
