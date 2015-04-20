var Marionette = require('backbone.marionette');
var session = require('../models/session');
var User = require('../models/user');
var LayoutView = require('../views/layout/one');
var LoginView = require('../views/session_login');
var RegisterView = require('../views/session_register');
var FindPwdView = require('../views/session_pwd');
var RegionManager = require('../lib/regionManager');

module.exports = Marionette.Controller.extend({

    initialize: function(options) {
        this.region = RegionManager.getRegion('main');
    },

    prepare: function(route) {
        if (!this.region.currentView || this.region.currentView != this.layout) {
            this.layout = new LayoutView();
            this.region.show(this.layout);
        }
    },

    showLoginPage: function(redirect) {
        session.redirect = redirect;

        this.layout.content.show(new LoginView({
            model: session
        }));
    },

    showRegisterPage: function() {
        this.layout.content.show(new RegisterView({
            model: new User()
        }));

        console.log('user controller show register page!');
    },

    showFindPasswordPage: function() {
        this.layout.content.show(new FindPwdView());

        console.log('session controller show find password page!');
    }
});
