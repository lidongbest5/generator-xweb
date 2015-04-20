var Marionette = require('backbone.marionette');
var tmpl = require('../../templates/userlist');
var ChildView = require('./userlist_item');

/* Return a ItemView class definition */
module.exports = Marionette.CompositeView.extend({

    initialize: function() {
        console.log("initialize a userlist view");
    },

    template: tmpl,

    childView: ChildView,

    childViewContainer: 'tbody',

    /* ui selector cache */
    ui: {},

    /* Ui events hash */
    events: {},

    /* on render callback */
    onRender: function() {},

    childViewOptions: function(model, index) {
        // do some calculations based on the model
        return {
            rank: index
        }
    }
});
