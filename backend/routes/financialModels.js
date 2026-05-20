const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'financial_models',
  fields: ['model_id','deal_id','name','version','base_case_irr','status'],
});
