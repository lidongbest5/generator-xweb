var sinon = require('sinon');
var userData = require('./data/user');
var _ = require('underscore');

sinon.log = function (message) {  console.log(message); };

var server = sinon.fakeServer.create();
server.xhr.useFilters = true;
server.autoRespond = true;

var session = {};


/**
 * Don't fake socket.io calls
 */
server.xhr.addFilter(function(method, url, async, username, password) {
    if ((new RegExp("browser-sync", "i")).test(url)) {
        return true;
    }
});


server.respondWith(
    "GET",
    "/api/users",
    function(xhr) {
        var array = _.map(userData, function(user){
            return user;
        });

        xhr.respond(200, {
            "Content-Type": "application/json"
        }, JSON.stringify(array));
    }
);


server.respondWith(
    "GET",
    /\/api\/users\/(\d+)/,
    function(xhr, id) {
        xhr.respond(200, {
            "Content-Type": "application/json"
        }, JSON.stringify(userData[id]));
    }
);


server.respondWith(
    "PUT",
    /\/api\/users\/(\d+)/,
    function(xhr, id) {

        userData[id] = JSON.parse(xhr.requestBody);
        if (id == sessionData.user._id) {
            sessionData.user = userData[id]
        }

        xhr.respond(200, {
            "Content-Type": "application/json"
        }, JSON.stringify(userData[id]));
    }
);


server.respondWith(
    "GET",
    /\/api\/sessions\/(\d+)/,
    function(xhr) {
        xhr.respond(200, {
            "Content-Type": "application/json"
        }, JSON.stringify(session));
    }
);


server.respondWith(
    "PUT",
    /\/api\/sessions\/(\d+)/,
    function(xhr) {
        req = JSON.parse(xhr.requestBody);
        if (req.action == 'login') {
            session.user = userData['0000001'];
            session.auth = true;
            session.last_login_time = new Date();
            session.id = '0000001';
        }

        xhr.respond(200, {
            "Content-Type": "application/json"
        }, JSON.stringify(session));
    }
);


server.respondWith(
    "POST",
    "/api/sessions",
    function(xhr) {
        req = JSON.parse(xhr.requestBody);
        if (req.action == 'login') {
            session.user = userData['0000001'];
            session.auth = true;
            session.last_login_time = new Date();
            session.id = '0000001';
        }else{
            session = {
                id: '0000000',
                auth: false
            };
        }

        xhr.respond(200, {
            "Content-Type": "application/json"
        }, JSON.stringify(session));
    }
);
