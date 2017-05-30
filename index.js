var db = require('./lib/db');
var model = require('./lib/model');
var query_builder = require('./lib//query_builder');

function Depeche ( ) {
  this.db = db;
  this.model = model;
  this.query_builder = query_builder;
}

module.exports = exports = new Depeche();
