const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'integration_plans',
  fields: ['plan_id','deal_id','workstream','lead','deadline','status'],
});
