const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'buyer_pipeline',
  fields: ['buyer_id','deal_id','buyer_name','buyer_type','contact_name','contact_email','stage','interest_score','last_touch_date','next_step','notes'],
});
