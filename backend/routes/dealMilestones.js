const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'deal_milestones',
  fields: ['milestone_id','deal_id','title','category','owner','start_date','due_date','status','dependency','notes'],
});
