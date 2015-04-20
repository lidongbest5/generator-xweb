/**
 * global
 */
window.$ = require('jquery');


/**
 * common base
 */
require('./lib/common');
require('./lib/jQueryExtend');
require('./lib/hbsHelper');
require('todo');
require('bootstrap');
require('routefilter');


/**
 *  Start App
 */
var Backbone = require('backbone');
Backbone.$ = window.$;
var Marionette = require('backbone.marionette');
var Communicator = require('./lib/communicator');
var HeaderView = require('./views/header');
var UserRoute = require('./routers/user');
var SessionRoute = require('./routers/session');
var session = require('./models/session');


/* global region */
var RegionManager = require('./lib/regionManager');
RegionManager.addRegion('main', '#main');


var App = new Marionette.Application();

App.addInitializer(function() {
    /* Full Page Modal */
    var region = RegionManager.addRegion('modal', '#myModal .modal-content');

    Communicator.command.setHandler("MODAL:SHOW", function(view) {
        $('#myModal').modal('show');
        region.show(view);
    });
});

App.addInitializer(function() {
	/* global view */
    var region = RegionManager.addRegion('header', 'header');
    region.show(new HeaderView());
});

App.addInitializer(function() {

}); 

App.addInitializer(function() {
	/* routers & controllers */
	new UserRoute();
    new SessionRoute();

    // start session
    session.save();

    Communicator.vent.trigger("APP:START");
    Backbone.history.start();
});


module.exports = App;
