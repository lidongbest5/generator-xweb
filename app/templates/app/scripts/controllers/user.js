var Marionette = require('backbone.marionette');
var session = require('../models/session');
var User = require('../models/user');
var UserCol = require('../collections/user');
var LayoutView = require('../views/layout/one');
var SessionView = require('../views/user_about');
var ProfileView = require('../views/user_profile');
var PwdEditorView = require('../views/user_pwd_editor');
var RegionManager = require('../lib/regionManager');
var UserlistView = require('../views/userlist');


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

    aboutme: function() {
        var that = this;
        session.fetch()
        .then(function () {
            that.layout.content.show(new SessionView({model: session}));
        })
        .fail(function (){
            console.log('failed');
        })
    },

    profile: function() {
        var that = this;
        var user = new User(session.get('user'));

        user.fetch()
        .done( function() {
            console.log(user)
            that.layout.content.show(new ProfileView({model: user}))
        })
        .fail( function() {
            console.log('get user failed, id: ' + user.get('_id'));
        });
    },

    passwordEditor: function() {
        var that = this;
        var user = new User(session.get('user'));

        user.fetch()
        .done( function() {
            that.layout.content.show(new PwdEditorView({model: user}))
        })
        .fail( function() {
            console.log('get user failed, id: ' + user.get('_id'));
        });
    },

    userlist: function() {
        var that = this;
        var users = new UserCol();
        users.fetch().done(function() {
            console.log(users);
            that.layout.content.show(new UserlistView({collection: users}));
        })
        .fail(function() {
            console.log('get user lsit faied');
        });
    }
});
