var Marionette = require('backbone.marionette');
var SessionTmpl = require('../../templates/user_about');

/* Return a ItemView class definition */
module.exports = Marionette.ItemView.extend({

    initialize: function () {
        console.log("initialize a Session ItemView");
    },

    template: SessionTmpl,

    /* ui selector cache */
    ui: {'logoutBtn': '#btn-logout'},

    /* Ui events hash */
    events: {'click @ui.logoutBtn': 'logout'},

    logout: function () {
        var session = this.model;

        session.save({action: 'logout'}, {
            success: function () {
                console.log('logged out');
                location.href = '#login';
            },
            error: function () {
                console.log('log out failed');
            }
        });
    },

    /* on render callback */
    onRender: function () {
    }
});
