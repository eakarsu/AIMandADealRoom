const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'due_diligence_items',
  fields: ['dd_id','deal_id','area','owner','status','findings'],
});
