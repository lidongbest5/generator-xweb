var Backbone = require('backbone');
var User = require('../models/user');

/* Return a collection class definition */
module.exports = Backbone.Collection.extend({
	initialize: function() {
		console.log("initialize a User collection");
	},

	model: User,

  url: '/api/users'

});
