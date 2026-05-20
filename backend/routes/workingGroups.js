const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'working_groups',
  fields: ['group_id','deal_id','workstream','lead','members_count','status'],
});
