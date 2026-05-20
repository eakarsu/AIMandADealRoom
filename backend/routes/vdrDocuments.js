const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'vdr_documents',
  fields: ['doc_id','deal_id','name','category','uploaded_at','version'],
});
