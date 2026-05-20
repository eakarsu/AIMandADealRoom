const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'q_and_a',
  fields: ['qa_id','deal_id','question','asker','answer','status'],
});
