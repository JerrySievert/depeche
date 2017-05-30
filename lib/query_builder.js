function QueryBuilder (model) {
  this.current = 0;
}


QueryBuilder.prototype.select = function select_query_builder (model) {
  var columns = [ ];

  for (var i = 0; i < model._fields.length; i++) {
    if (model._select_override[model._fields[i]] !== undefined) {
      columns.push(model._select_override[model._fields[i]].replace('?', model._fields[i]) + ' AS ' + model._fields[i]);
    } else {
      columns.push(model._fields[i]);
    }
  }
  var query = 'SELECT ' + columns.join(', ') + ' FROM ' + model._table;

  if (model._where.length) {
    query += ' WHERE ';

    var parts = [ ];
    for (var i = 0; i < model._where.length; i++) {
      if (model._select_override[model._where[i]] !== undefined) {
        var override = model._select_override[model._where[i]].replace('?', '$' + (i + 1));
        parts.push(model._where[i] + model._operators[i] + override);
      } else {
        parts.push(model._where[i] + model._operators[i] + '$' + (i + 1));
      }
    }

    query += parts.join(' AND ');
  }

  if (model._order !== '') {
    query += ' ORDER BY ' + model._order + ' ';
  }

  if (model._limit) {
    query += ' LIMIT ' + model._limit;
  }

  return query;
};

QueryBuilder.prototype._insert_stub = function _insert_stub (model) {
  var query = 'INSERT INTO ' + model._table + ' (';
  var fields = [ ];
  var params = [ ];

  this.current = 0;

  for (var i = 0; i < model._fields.length; i++) {
    if (model[model._fields[i]] !== undefined && model[model._fields[i]] !== null && model._fields[i]) {
      if (model._insert_override[model._fields[i]] !== undefined) {
        var override = model._insert_override[model._fields[i]].replace('?', '$' + (this.current + 1));
        params.push(override);
      } else {
        params.push('$' + (this.current + 1));
      }
      fields.push(model._fields[i]);
      this.current++;
    }
  }

  query += fields.join(', ');
  query += ') VALUES (';

  query += params.join(', ');
  query += ')';

  return query;
};

QueryBuilder.prototype.insert = function insert_query_builder (model) {
  var query = this._insert_stub(model);

  query += ' RETURNING *';

  return query;
};

QueryBuilder.prototype.upsert = function upsert_query_builder (model) {
  var parts = [ ];
  var query = this._insert_stub(model);

  query += ' ON CONFLICT (';

  if (Array.isArray(model._primary)) {
    query += model._primary.join(', ');
  } else {
    query += model._primary;
  }

  query += ') DO UPDATE SET ';

  for (var i = 0; i < model._fields.length; i++) {
    if (model._fields[i] !== model._primary) {
      if (model._insert_override[model._fields[i]] !== undefined) {
        var override = model._insert_override[model._fields[i]].replace('?', '$' + (this.current + 1));
        parts.push(model._fields[i] + ' = ' + override);
      } else {
        parts.push(model._fields[i] + ' = $' + (this.current + 1));
      }

      this.current++;
    }
  }

  query += parts.join(', ');
  query += ' WHERE ';

  if (Array.isArray(model._primary)) {
    var where = [ ];

    for (i = 0; i < model._primary.length; i++) {
      where.push(model._table + '.' + model._primary[i] + ' = $' + (this.current + 1));
      this.current++;
    }

    query += where.join(' AND ');
  } else {
    query += model._table + '.' + model._primary;
    query += ' = $' + (this.current + 1);
  }

  query += ' RETURNING *';

  return query;
};

QueryBuilder.prototype.update = function update_query_builder (model) {
  var parts = [ ];
  this.current = 0;

  var query = 'UPDATE ' + model._table + ' SET ';

  for (var i = 0; i < model._fields.length; i++) {
    if (model._fields[i] !== model._primary) {
      if (model._insert_override[model._fields[i]] !== undefined) {
        var override = model._insert_override[model._fields[i]].replace('?', '$' + (this.current + 1));
        parts.push(model._fields[i] + ' = ' + override);
      } else {
        parts.push(model._fields[i] + ' = $' + (this.current + 1));
      }

      this.current++;
    }
  }

  // TODO: array where clause
  query += parts.join(', ');
  query += ' WHERE ' + model._primary + ' = $' + (this.current + 1);
  query += ' RETURNING *';

  return query;
};

exports = module.exports = QueryBuilder;
