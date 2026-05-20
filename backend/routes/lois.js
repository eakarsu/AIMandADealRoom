const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'lois',
  fields: ['loi_id','deal_id','buyer','value_usd','exclusivity_days','status'],
});
