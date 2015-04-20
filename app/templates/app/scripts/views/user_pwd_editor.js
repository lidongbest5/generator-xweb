var Marionette = require('backbone.marionette');
var PasswordEditorTmpl = require('../../templates/user_pwd_editor');
var AlertView = require('./alert');
var Model = require('backbone').Model;
var md5 = require('blueimp-md5').md5;
var handleErrorResponse = require('../lib/handleErrorResponse');

/* Return a ItemView class definition */
module.exports = Marionette.ItemView.extend({

    initialize: function() {
        console.log("initialize a PasswordEditor ItemView");
    },

    template: PasswordEditorTmpl,


    /* ui selector cache */
    ui: {
        'form': '#form-pwd',
        'okButton': '#btn-ok',
        'alertBlock': '#block-alert'
    },

    /* Ui events hash */
    events: {
        'click @ui.okButton': 'submit'
    },

    submit: function() {
        var that = this;
        var creds = this.ui.form.serializeObject();

        if (!creds.originPassword) {
            this.showMessage({
                message: 'Empty origin password.',
                path: 'password'
            });
            return false;
        }

        if (!creds.newPassword || creds.newPassword.trim().length < 6) {
            this.showMessage({
                message: 'Invalid new password.',
                path: 'password'
            });
            return false;
        }

        creds.originPassword = md5(creds.originPassword);
        creds.newPassword = md5(creds.newPassword);

        this.model.save(creds).then(function(model, resp) {
            that.showMessage({
                message: 'Updated password successfully.',
                path: 'password'
            }, 'success');
        }, function(resp) {
            handleErrorResponse(resp, that.showMessage, that);
        });

        return false;
    },

    showMessage: function(o, type) {
        var type = type || 'danger';

        var m = new Model(o);
        m.set('type', type);
        this.ui.alertBlock.append(new AlertView({
            model: m
        }).render().el);

    },

    /* on render callback */
    onRender: function() {}
});
