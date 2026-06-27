const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'marketing_materials',
  fields: ['material_id','deal_id','material_type','title','owner','version','status','shared_at','notes'],
});
