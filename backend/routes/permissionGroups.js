const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'permission_groups',
  fields: ['group_id','deal_id','group_name','group_type','members_count','access_level','watermark','status','notes'],
});
