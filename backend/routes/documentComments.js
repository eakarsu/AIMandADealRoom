const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'document_comments',
  fields: ['comment_id','doc_id','deal_id','author','visibility','page_ref','comment_body','status'],
});
