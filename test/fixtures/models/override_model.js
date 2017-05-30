var model = require('../../../lib/model');

function OverrideModel ( ) {
  this._table = 'override_model';
  this._primary = 'id';
  this._fields = [
    'id',
    'some_field',
    'some_other_field',
    'created_date'
  ];

  model.extend(this, OverrideModel);

  this._insert_override.some_field = 'UPPER(?)';
  this._select_override.some_field = 'LOWER(?)';
}

module.exports = exports = OverrideModel;
