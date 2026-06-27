const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'approval_workflows',
  fields: ['approval_id','deal_id','artifact_type','artifact_id','approver','approval_step','due_date','status','decision_notes'],
});
