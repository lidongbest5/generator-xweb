'use strict';
var Marionette      = require('backbone.marionette');

var RegionManager = Marionette.Controller.extend({

  initialize: function( options ) {
    console.log("Initialize a Region Manager");

    /* internal region manager */
    this._regionManager = new Marionette.RegionManager();
  },

  /* add region facade */
  addRegion: function( regionName, regionId ) {
    var region = this.getRegion( regionName );

    if( region ) {
      console.log("REGION ALREADY CREATED TO JUST RETURN REF");
      return region;
    }

    return this._regionManager.addRegion( regionName, regionId );
  },

  /* remove region facade */
  removeRegion: function( regionName ) {
    this._regionManager.removeRegion( regionName );
  },

  /* get region facade */
  getRegion: function( regionName ) {
    return this._regionManager.get( regionName );
  }
});

module.exports = new RegionManager();
