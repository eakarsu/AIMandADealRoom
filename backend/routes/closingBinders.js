const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'closing_binders',
  fields: ['binder_id','deal_id','binder_name','binder_type','document_count','owner','export_format','status','exported_at','notes'],
});
