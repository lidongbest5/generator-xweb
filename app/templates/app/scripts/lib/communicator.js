'use strict';
var Backbone        = require('backbone');

var Communicator = Backbone.Marionette.Controller.extend({
  initialize: function( options ) {
    console.log("initialize a Communicator");

    // create a pub sub
    this.vent = new Backbone.Wreqr.EventAggregator();

    //create a req/res
    this.reqres = new Backbone.Wreqr.RequestResponse();

    // create commands
    this.command = new Backbone.Wreqr.Commands();
  }
});

module.exports = new Communicator();
