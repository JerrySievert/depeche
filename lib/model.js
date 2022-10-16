var db = require('./db');
var query_builder = require('./query_builder');
var extend = require('extend');

function Model() {
  this._where = [];
  this._params = [];
  this._operators = [];
  this._limit = 0;
  this._order = '';
  this._desc = false;
  this._select_override = {};
  this._insert_override = {};
  this._query_builder = new query_builder();
  this._where_clause = '';
}

Model.prototype._models_from_results = function _models_from_results(data) {
  var ret = [];
  var self = this;

  data.rows.forEach(function (c, i, a) {
    var m = new self._model();
    m._fields = self._fields;
    m._table = self._table;

    self._fields.forEach(function (c2, i2, a2) {
      m[c2] = c[c2];
    });

    ret.push(m);
  });

  return ret;
};

Model.prototype.where = function where(field) {
  this._where.push(field);

  return this;
};

Model.prototype.where_clause = function where_clause(clause) {
  this._where_clause = clause;

  return this;
};

Model.prototype.eq = function eq(value) {
  this._params.push(value);
  this._operators.push('=');

  return this;
};

Model.prototype.gte = function gte(value) {
  this._params.push(value);
  this._operators.push('>=');

  return this;
};

Model.prototype.lte = function lte(value) {
  this._params.push(value);
  this._operators.push('<=');

  return this;
};

Model.prototype.lt = function lt(value) {
  this._params.push(value);
  this._operators.push('<');

  return this;
};

Model.prototype.gt = function gt(value) {
  this._params.push(value);
  this._operators.push('>');

  return this;
};

Model.prototype.array_contains = function array_contains(value) {
  this._params = this._params.concat(value);
  var params = [];
  value.forEach((e) => {
    params.push(' ?');
  });

  this._operators.push('@> ARRAY[' + params.join(',') + ' ]');

  return this;
};

Model.prototype.in = function array_in(value) {
  this._params = this._params.concat(value);
  var params = [];
  value.forEach((e) => {
    params.push(' ?');
  });

  this._operators.push('IN (' + params.join(',') + ' )');

  return this;
};

Model.prototype.ilike = function ilike(value) {
  this._params.push(value);
  this._operators.push(' ILIKE ');

  return this;
};

Model.prototype.like = function like(value) {
  this._params.push(value);
  this._operators.push(' LIKE ');

  return this;
};

Model.prototype.custom_where = function custom_where(clause, value) {
  this._where.push(clause);
  this._params.push(value);

  return this;
};

Model.prototype.limit = function limit(value) {
  this._limit = value;

  return this;
};

Model.prototype.order = function order(order_by) {
  this._order = order_by;
  return this;
};

Model.prototype.desc = function desc() {
  this._desc = true;
  return this;
};

Model.prototype.all = async function all(callback) {
  var query = this._query_builder.select(this);

  const results = await db.query(query, this._params);

  return this._models_from_results(results);
};

Model.prototype.insert = async function insert(callback) {
  var query = this._query_builder.insert(this);

  var params = [];

  this._fields.forEach(function (c, i, a) {
    if (self[c] !== undefined && self[c] !== null) {
      params.push(self[c]);
    }
  });

  const data = await db.query(query, params);
  return this._models_from_results(data);
};

Model.prototype.update = async function update(callback) {
  var params = [];

  var idx = this._fields.indexOf(this._primary);

  if (
    this[this._fields[idx]] === undefined ||
    this[this._fields[idx]] === undefined
  ) {
    throw new Error('id is empty, did you mean to run insert?');
  }

  var query = this._query_builder.update(this);

  // TODO: array primary key
  for (var i = 0; i < this._fields.length; i++) {
    if (this._fields[i] !== this._primary) {
      if (this[this._fields[i]] === undefined) {
        params.push(null);
      } else {
        params.push(this[this._fields[i]]);
      }
    }
  }

  params.push(this[this._fields[idx]]);

  const data = await db.query(query, params);

  return this._models_from_results(data);
};

Model.prototype.upsert = async function update(callback) {
  var params = [];

  if (this._primary === undefined) {
    throw new Error('model is missing a primary key for table ' + this._table);
  }

  var query = this._query_builder.upsert(this);
  var idx = this._fields.indexOf(this._primary);

  for (var i = 0; i < this._fields.length; i++) {
    if (this[this._fields[i]] !== undefined) {
      params.push(this[this._fields[i]]);
    }
  }

  // TODO: check for array primary key here
  for (i = 0; i < this._fields.length; i++) {
    if (i !== idx) {
      if (this[this._fields[i]] === undefined) {
        params.push(null);
      } else {
        params.push(this[this._fields[i]]);
      }
    }
  }

  params.push(this[this._fields[idx]]);

  const data = await db.query(query, params);

  return this._models_from_results(data);
};

Model.prototype.toJSON = function toJSON() {
  var json = {};

  for (var i = 0; i < this._fields.length; i++) {
    json[this._fields[i]] = this[this._fields[i]];
  }

  return json;
};

Model.extend = function _extend(obj, model) {
  extend(true, obj, new Model());
  obj._model = model;
};

Model.db = db;
Model.prototype.db = db;

module.exports = exports = Model;
