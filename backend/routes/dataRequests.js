const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'data_requests',
  fields: ['request_id','deal_id','workstream','requested_item','requested_from','owner','priority','due_date','status','response_summary'],
});
