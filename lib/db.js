var pg = require('pg');

var conf;
var pool;

function config(database) {
  conf = {};

  if (database.username) {
    conf.user = database.username;
  }

  if (database.password) {
    conf.password = database.password;
  }

  if (database.hostname) {
    conf.host = database.hostname;
  }

  if (database.database) {
    conf.database = database.database;
  }

  if (database.maxConnections) {
    conf.max = database.maxConnections;
  }
}

function query() {
  if (conf === undefined) {
    throw new Error("No database connection configured.");
  }

  if (pool === undefined) {
    pool = new pg.Pool(conf);
  }

  var args = Array.prototype.slice.call(arguments);
  var callback = args.pop();

  if (typeof callback !== 'function') {
    args.push(callback);
    callback = null;
  }

  pool.connect(function(err, cl, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    args.push(function(err, results) {
      if (callback) {
        callback(err, results);
      }
      done();
    });

    cl.query.apply(cl, args);
  });
}

exports.query = query;
exports.config = config;
