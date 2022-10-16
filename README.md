# Depeche

Fast models.

This is a package used for my personal projects. It has grown over time, and
it made sense to release it as a module.

## Usage

```
$ npm install --save depeche
```

_file.js_:

```
const Depeche = require('depeche');

function Model ( ) {
  this._table = 'model';
  this._primary = 'id';
  this._fields = [
    'id',
    'some_field',
    'some_other_field',
    'created_date'
  ];

  Depeche.model.extend(this, Model);
}

const model = new Model();
```

### Configuration

Configuration occurs once, and is used for all database activity after
configuration.

```
const Depeche = require('depeche');

Depeche.db.config({
  username: 'username',
  password: 'password',
  hostname: 'hostname',
  password: 'password'
});
```

### Insert

```
const model = new Model();

model.some_field = 'Hello';
model.some_other_fields = 'World';

const rows - await model.insert();
```

### Query

```
const model = new Model();

model.where('some_field').eq('Hello');

const rows = await model.all();
console.log(`Found ${rows.length} rows`);
```
