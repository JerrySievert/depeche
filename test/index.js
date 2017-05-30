var test = require('tape');
var depeche = require('../index');

test('a model can be built from depeche', function (t) {
  t.plan(1);

  function Model ( ) {
    this._table = 'model';
    this._primary = 'id';
    this._fields = [
      'id',
      'some_field',
      'some_other_field',
      'created_date'
    ];

    depeche.model.extend(this, Model);
  }

  var model = new Model();

  t.equal(typeof model, 'object', 'model is created');
});

test('a query can be built from depeche', function (t) {
  t.plan(1);

  function Model ( ) {
    this._table = 'model';
    this._primary = 'id';
    this._fields = [
      'id',
      'some_field',
      'some_other_field',
      'created_date'
    ];

    depeche.model.extend(this, Model);
  }

  var model = new Model();

  model.some_field = 'foo';
  model.some_other_field = 'bar';

  var builder = new depeche.query_builder();

  var sql = builder.insert(model);

  t.equal(sql, 'INSERT INTO model (some_field, some_other_field) VALUES ($1, $2) RETURNING *', 'basic insert query is correct');
});
