const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'closing_checklist',
  fields: ['check_id','deal_id','item','owner','due_date','status'],
});
