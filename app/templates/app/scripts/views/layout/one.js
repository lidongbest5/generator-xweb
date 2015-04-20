var Marionette = require('backbone.marionette');
var tmpl = require('../../../templates/layout/one');

/* Return a Layout class definition */
module.exports = Marionette.LayoutView.extend({

  initialize: function() {
    console.log("initialize a one view Layout");
  },

  template: tmpl,

  /* Layout sub regions */
  regions: {
    content: '#content'
  },

  /* ui selector cache */
  ui: {},

  /* Ui events hash */
  events: {

  },

  /* on render callback */
  onRender: function() {}
});
