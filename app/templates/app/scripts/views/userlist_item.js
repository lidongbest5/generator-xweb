var Marionette = require('backbone.marionette');
var tmpl = require('../../templates/userlist_item');
var Communicator = require('../lib/communicator');
var Sparkline = require('sparklines');


/* Return a ItemView class definition */
module.exports = Marionette.ItemView.extend({

    initialize: function (options) {
        console.log("initialize a userlist view");
        this.model.set('rank', 1 + options.rank);
    },

    template: tmpl,

    tagName: 'tr',

    /* ui selector cache */
    ui: {
    }
});
