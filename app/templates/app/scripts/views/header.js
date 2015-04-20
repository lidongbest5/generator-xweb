var Marionette = require('backbone.marionette');
var tmpl = require('../../templates/header');
var Communicator = require('../lib/communicator');
var moment = require('moment');

/* Return a ItemView class definition */
module.exports = Marionette.ItemView.extend({

    initialize: function() {
        console.log("initialize header nav");
    },

    template: tmpl,

    /* ui selector cache */
    ui: {
        searchButton: '.btn-search',
        keywordInput: '#input-search',
        filterForm: '#form-filter',
        switcher: '#sw-filter'
    },

    /* Ui events hash */
    events: {
        'click @ui.searchButton': 'search',
        'keypress @ui.keywordInput': 'keypressOnSearchInput'
    },

    /* on render callback */
    onRender: function() {},

    keypressOnSearchInput: function(e) {
        if (e.which === 13) {
            this.search();
        }
    },

    search: function() {
        this.ui.switcher.removeClass('open');

        var params = this.ui.filterForm.serializeObject();        
        var inputVal = this.ui.keywordInput.val();

        var keywords = inputVal.split(' ')
        
        params.tags = "";
        params.term = "";
        _.each(keywords, function(keyword){
            if(keyword.charAt(0) == '#'){
               params.tags += keyword.substr(1) + ' ';
            }else{
                params.term += keyword + ' ';
            }
        });

        params.tags = params.tags.trim();
        params.term = params.term.trim();

        switch(params.dateRange){
            case 'd30':
                params.start = moment().subtract('day', 30).toISOString();
                break;
            case 'd7':
                params.start = moment().subtract('day', 7).toISOString();
                break;
            case 'h24':
                params.start = moment().subtract('hour', 24).toISOString();
                break;
        }

        params.end = moment().toISOString();
        delete params.dateRange;

        Communicator.command.execute("SEARCH", params);

        return false;
    }
});
