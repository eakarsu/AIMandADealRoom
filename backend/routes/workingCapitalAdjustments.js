const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'working_capital_adjustments',
  fields: ['wca_id','deal_id','item','amount_usd','direction','status'],
});
