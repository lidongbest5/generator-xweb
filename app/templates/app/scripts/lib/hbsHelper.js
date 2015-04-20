var Handlebars = require("hbsfy/runtime");
var moment     = require('moment');


/* return formated date, by default is LLLL */
Handlebars.registerHelper('formatDate', function(date, format) {
  var m = moment(date);
  var f = format || 'LLLL';
  return m.format(f);
});

/* return friendly date */
Handlebars.registerHelper('friendlyDate', function(date) {
  return moment(date).fromNow();
});

/* return short id, last 6 number */
Handlebars.registerHelper('shortId', function(id) {
  return id.substr(id.length - 6, 6);
});