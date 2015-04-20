var Backbone = require('backbone');

/* Return a model class definition */
var Session = Backbone.Model.extend({
  urlRoot: '/api/sessions',

  initialize: function() {
    console.log("initialize a Session model");
  },

  defaults: {
    auth: false
  }

});

/* change it if you want to support multi sessions */
module.exports = new Session();
