const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'document_comparisons',
  fields: ['comparison_id','deal_id','base_doc_id','revised_doc_id','comparison_type','risk_level','material_changes','reviewer','status'],
});
