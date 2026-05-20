const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'post_close_reports',
  fields: ['report_id','deal_id','period','kpi','value','status'],
});
