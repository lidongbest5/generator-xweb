var Communicator = require('../lib/communicator');
var Marionette = require('backbone.marionette');
var UserCtrl = require('../controllers/user');
var session = require('../models/session');

module.exports = Marionette.AppRouter.extend({

    initialize: function(options) {
        var that = this;
        this.controller = new UserCtrl();
    },

    before: function() {
        if(!session.get('auth')){
            Communicator.command.execute('JUMPTOLOGIN');
            return false;
        }

        this.controller.prepare();
    },

    appRoutes: {
        '': 'userlist',
        'aboutme': 'aboutme',
        'profile': 'profile',
        'password-editor': 'passwordEditor'
    },

    /* Backbone routes hash */
    routes: {}
});
