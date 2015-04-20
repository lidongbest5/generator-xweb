var Marionette = require('backbone.marionette');
var Communicator = require('../lib/communicator');
var Ctrl = require('../controllers/session');
var Backbone = require('backbone');


module.exports = Marionette.AppRouter.extend({

    initialize: function(options) {
        var that = this;
        this.controller = new Ctrl();

        Communicator.command.setHandler("JUMPTOLOGIN", function(){
            console.log('not log in')
            var fragment = Backbone.history.getFragment();
            fragment = fragment ? 'login/redirect=' + fragment : 'login';
            that.navigate(fragment, true);
        });
    },

    appRoutes: {
        'login': 'showLoginPage',
        'login/redirect=:url': 'showLoginPage',
        'register': 'showRegisterPage',
        'findPassword': 'showFindPasswordPage'
    },

    /* Backbone routes hash */
    routes: {},

    controller: {

        profile: function() {
            console.log('from another route')
        }
    },

    before: function(route, params) {
        this.controller.prepare();
    }
});
