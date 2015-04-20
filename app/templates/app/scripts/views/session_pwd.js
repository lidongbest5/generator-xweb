var Marionette = require('backbone.marionette');
var Communicator = require('../lib/communicator');
var FindpasswordTmpl = require('../../templates/session_pwd');
var AlertView = require('./alert');
var md5 = require('blueimp-md5').md5;
var Users = require('../collections/user');
var User = require('../models/user');
var Model = require('backbone').Model;
var handleErrorResponse = require('../lib/handleErrorResponse');
var validationTool = require('../lib/validationTool');

/* Return a ItemView class definition */
module.exports = Marionette.ItemView.extend({

    initialize: function() {
        console.log("initialize a Findpassword ItemView");
    },

    template: FindpasswordTmpl,

    /* ui selector cache */
    ui: {
        resetButton: '#btn-reset',
        resetForm: '#form-reset',
        alertBlock: '#block-alert',
        codeButton: '#btn-code'
    },

    /* Ui events hash */
    events: {
        'click @ui.resetButton': 'resetPassword',
        'click @ui.codeButton': 'requestCode'
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

        var users = new Users();
        users.baucis({
            conditions: {
                email: email
            }
        }).then(function() {

            if (users.length >= 1) {
                $.get("/api/users/secureCode", {
                    email: email
                }, function(result) {
                    var message = result.success ? 'Sent email successfully.' : 'Failed to send email, check your address.';
                    var showFunc = result.success ? that.showMessage : that.showError;
                    showFunc({
                        message: message
                    });
                });
            } else {
                that.showError({
                    message: 'User does not exist.',
                    path: 'account'
                });
            }

        }, function(error) {
            handleErrorResponse(error, that.showError, that)
        });

        return false;
    },

    resetPassword: function() {
        var that = this;
        var creds = this.ui.resetForm.serializeObject();

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
                path: 'code'
            });
            return false;
        }

        creds.password = md5(creds.password);
        creds.isCrypted = true;

        var users = new Users();
        users.baucis({
            conditions: {
                email: creds.email
            }
        }).then(function() {
            if (users.length < 1) {
                this.showError({
                    message: 'User does not exist.',
                    path: 'account'
                });
                return false;
            }

            var user = users.at(0);
            return user.save(creds);
        }).then(function(resp) {
            return this.showMessage({
                message: 'Updated password successfully.',
                path: 'password'
            });
        }, function(resp) {
            handleErrorResponse(resp, that.showError, that)
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
