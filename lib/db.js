const { Pool, Client } = require('pg');

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

  if (database.port) {
    conf.port = database.port;
  }
}

async function query() {
  if (conf === undefined) {
    throw new Error('No database connection configured.');
  }

  if (pool === undefined) {
    pool = new Pool(conf);
  }

  const args = Array.prototype.slice.call(arguments);

  const results = await pool.query(...args);

  return results;
}

exports.query = query;
exports.config = config;
