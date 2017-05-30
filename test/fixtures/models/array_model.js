var model = require('../../../lib/model');

function ArrayModel ( ) {
  this._table = 'array_model';
  this._primary = [ 'some_field', 'some_other_field' ];
  this._fields = [
    'id',
    'some_field',
    'some_other_field',
    'created_date'
  ];

  model.extend(this, ArrayModel);
}

module.exports = exports = ArrayModel;
