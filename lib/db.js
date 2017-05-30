var pg     = require('pg');

var conString;

function config (database) {
  conString = 'postgres://' + database.username + ':' +
                  database.password + '@' +
                  database.hostname + '/' +
                  database.database;
}

function query( ) {
  if (conString === undefined) {
    throw new Error("No database connection configured.");
  }

  var args     = Array.prototype.slice.call(arguments);
  var callback = args.pop( );

  if (typeof callback !== 'function') {
    args.push(callback);
    callback = null;
  }

  pg.connect(conString, function(err, cl, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    args.push(function(err, results) {
      if (callback) {
        callback(err, results);
      }
      done( );
    });

    cl.query.apply(cl, args);
  });
}

exports.query = query;
exports.config = config;
