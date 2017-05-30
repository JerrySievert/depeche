var model = require('../../../lib/model');

function BaseModel ( ) {
  this._table = 'base_model';
  this._primary = 'id';
  this._fields = [
    'id',
    'some_field',
    'some_other_field',
    'created_date'
  ];

  model.extend(this, BaseModel);
}

module.exports = exports = BaseModel;
