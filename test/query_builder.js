var test = require('tape');
var query = require('../lib/query_builder');

var base_model = require('./fixtures/models/base_model');
var override_model = require('./fixtures/models/override_model');
var array_model = require('./fixtures/models/array_model');

test('insert query builds from base model', function(t) {
  t.plan(1);

  var model = new base_model();

  model.some_field = 'foo';
  model.some_other_field = 'bar';

  var builder = new query();

  var sql = builder.insert(model);

  t.equal(sql, 'INSERT INTO base_model (some_field, some_other_field) VALUES ($1, $2) RETURNING *', 'basic insert query is correct');
});

test('insert query builds from model with insert override', function(t) {
  t.plan(1);

  var model = new override_model();

  model.some_field = 'foo';
  model.some_other_field = 'bar';

  var builder = new query();

  var sql = builder.insert(model);

  t.equal(sql, 'INSERT INTO override_model (some_field, some_other_field) VALUES (UPPER($1), $2) RETURNING *', 'override insert query is correct');
});

test('select query from base model', function(t) {
  t.plan(1);

  var model = new base_model();

  var builder = new query();

  var sql = builder.select(model);

  t.equal(sql, 'SELECT id, some_field, some_other_field, created_date FROM base_model', 'basic select query is correct');
});

test('select query from model with select override', function(t) {
  t.plan(1);

  var model = new override_model();

  var builder = new query();

  var sql = builder.select(model);

  t.equal(sql, 'SELECT id, LOWER(some_field) AS some_field, some_other_field, created_date FROM override_model', 'override select query is correct');
});

test('select query from model with where_clause', function(t) {
  t.plan(1);

  var model = new base_model();
  model.where_clause('1 = 1');

  var builder = new query();

  var sql = builder.select(model);

  t.equal(sql, 'SELECT id, some_field, some_other_field, created_date FROM base_model WHERE 1 = 1', 'where_clause select query is correct');
});

test('select query from model with where_clause and other where', function(t) {
  t.plan(1);

  var model = new base_model();
  model.where_clause('1 = 1');
  model.where('some_field').eq(1);

  var builder = new query();

  var sql = builder.select(model);

  t.equal(sql, 'SELECT id, some_field, some_other_field, created_date FROM base_model WHERE some_field=$1 AND 1 = 1', 'where_clause select query is correct with additional where');
});

test('upsert query from base model', function(t) {
  t.plan(1);

  var model = new base_model();

  model.some_field = 'foo';
  model.some_other_field = 'bar';

  var builder = new query();

  var sql = builder.upsert(model);

  t.equal(sql, 'INSERT INTO base_model (some_field, some_other_field) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET some_field = $3, some_other_field = $4, created_date = $5 WHERE base_model.id = $6 RETURNING *', 'basic upsert query is correct');
});

test('upsert query from override model', function(t) {
  t.plan(1);

  var model = new override_model();

  model.some_field = 'foo';
  model.some_other_field = 'bar';

  var builder = new query();

  var sql = builder.upsert(model);

  t.equal(sql, 'INSERT INTO override_model (some_field, some_other_field) VALUES (UPPER($1), $2) ON CONFLICT (id) DO UPDATE SET some_field = UPPER($3), some_other_field = $4, created_date = $5 WHERE override_model.id = $6 RETURNING *', 'override upsert query is correct');
});

test('upsert query from array model', function(t) {
  t.plan(1);

  var model = new array_model();

  model.some_field = 'foo';
  model.some_other_field = 'bar';

  var builder = new query();

  var sql = builder.upsert(model);

  t.equal(sql, 'INSERT INTO array_model (some_field, some_other_field) VALUES ($1, $2) ON CONFLICT (some_field, some_other_field) DO UPDATE SET id = $3, some_field = $4, some_other_field = $5, created_date = $6 WHERE array_model.some_field = $7 AND array_model.some_other_field = $8 RETURNING *', 'array upsert query is correct');
});

test('update query from base model', function(t) {
  t.plan(1);

  var model = new base_model();

  model.some_field = 'foo';
  model.some_other_field = 'bar';

  var builder = new query();

  var sql = builder.update(model);

  t.equal(sql, 'UPDATE base_model SET some_field = $1, some_other_field = $2, created_date = $3 WHERE id = $4 RETURNING *', 'basic upsert query is correct');
});

test('update query from override model', function(t) {
  t.plan(1);

  var model = new override_model();

  model.some_field = 'foo';
  model.some_other_field = 'bar';

  var builder = new query();

  var sql = builder.update(model);

  t.equal(sql, 'UPDATE override_model SET some_field = UPPER($1), some_other_field = $2, created_date = $3 WHERE id = $4 RETURNING *', 'override upsert query is correct');
});

test('select query from model with where and array_contains', function(t) {
  t.plan(1);

  var model = new base_model();
  model.where('some_field').eq(1);
  model.where('some_other_field').array_contains([1, 2, 3]);
  var builder = new query();

  var sql = builder.select(model);

  t.equal(sql, 'SELECT id, some_field, some_other_field, created_date FROM base_model WHERE some_field=$1 AND some_other_field @> ARRAY[ $2, $3, $4 ]', 'where clause select query is correct with array_contains');
});

test('select query from model with where and in', function(t) {
  t.plan(1);

  var model = new base_model();
  model.where('some_field').eq(1);
  model.where('some_other_field').in([1, 2, 3]);
  var builder = new query();

  var sql = builder.select(model);

  t.equal(sql, 'SELECT id, some_field, some_other_field, created_date FROM base_model WHERE some_field=$1 AND some_other_field IN ( $2, $3, $4 )', 'where clause select query is correct with array_contains');
});
