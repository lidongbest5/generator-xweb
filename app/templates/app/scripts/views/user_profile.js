var Marionette = require('backbone.marionette');
var ProfileTmpl = require('../../templates/user_profile');
var AlertView = require('./alert');
var Model = require('backbone').Model;
var handleErrorResponse = require('../lib/handleErrorResponse');

/* Return a ItemView class definition */
module.exports = Marionette.ItemView.extend({

    initialize: function() {
        console.log("initialize a Profile ItemView");
    },

    template: ProfileTmpl,

    /* ui selector cache */
    ui: {
        okBtn: '#btn-ok',
        allInputs: '#form-profile input',
        profileForm: 'form',
        alertBlock: '.alert-block'
    },

    /* Ui events hash */
    events: {
        'click @ui.okBtn': 'submit'
    },

    /* on render callback */
    onRender: function() {},


    submit: function() {
        var creds = this.ui.profileForm.serializeObject();
        var that = this;

        this.model.save(creds)
        .done(function (){
            that.showMessage({
                message: 'Updated profile successfully.',
                type: 'success'
            });
        })
        .fail(function (){
            console.log('failed with update profile');
        })

        //handleErrorResponse(resp, that.showMessage, that);

        return false;
    },

    showMessage: function(o, type) {
        var m = new Model(o);
        this.ui.alertBlock.append(new AlertView({
            model: m
        }).render().el);

    }
});
