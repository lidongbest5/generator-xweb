var Backbone = require('backbone');

/* Return a model class definition */
var User = module.exports = Backbone.Model.extend({
    idAttribute: "_id",

    urlRoot: '/api/users',

    initialize: function() {
        console.log("initialize a User model");
    },

    defaults: {}

});
