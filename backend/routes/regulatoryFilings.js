const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'regulatory_filings',
  fields: ['filing_id','deal_id','authority','type','status','filed_at'],
});
