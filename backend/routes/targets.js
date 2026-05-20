const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'targets',
  fields: ['target_id','name','sector','country','revenue_usd','ebitda_usd'],
});
