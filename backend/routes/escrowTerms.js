const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'escrow_terms',
  fields: ['escrow_id','deal_id','amount_usd','term_months','trigger','status'],
});
