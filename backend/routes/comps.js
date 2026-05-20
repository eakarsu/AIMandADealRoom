const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'comps',
  fields: ['comp_id','deal_id','target','multiple','metric','source'],
});
