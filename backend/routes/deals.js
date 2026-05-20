const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'deals',
  fields: ['deal_id','target_name','sector','deal_value_usd','stage','lead_advisor'],
});
