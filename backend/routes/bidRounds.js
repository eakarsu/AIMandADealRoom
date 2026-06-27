const buildCrud = require('./_crudFactory');

module.exports = buildCrud({
  table: 'bid_rounds',
  fields: ['round_id','deal_id','round_name','bid_deadline','invited_buyers','bids_received','top_bid_usd','status','decision_summary'],
});
