var Marionette = require('backbone.marionette');
var AlertTmpl = require('../../templates/alert');

/* Return a ItemView class definition */
module.exports = Marionette.ItemView.extend({

    initialize: function() {
        this.model.set('type', 'info');
    },

    template: AlertTmpl,


    /* ui selector cache */
    ui: {
        body: '.alert'
    },

    /* Ui events hash */
    events: {},

    /* on render callback */
    onRender: function() {
    }
});
