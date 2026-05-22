const express = require('express');
const router = express.Router();
function score(input = {}) {
  const buyers = input.buyers || [
    { buyer: 'Strategic A', vdr_views: 124, qna_threads: 18, model_downloads: 4 },
    { buyer: 'Sponsor B', vdr_views: 31, qna_threads: 2, model_downloads: 0 },
  ];
  return { buyers: buyers.map(b => {
    const engagement = Math.min(100, Number(b.vdr_views) * 0.35 + Number(b.qna_threads) * 2.2 + Number(b.model_downloads) * 8);
    return { ...b, engagement_score: Math.round(engagement), action: engagement >= 70 ? 'prioritize_management_meeting' : engagement >= 35 ? 'nurture' : 'low_intent' };
  }) };
}
router.get('/', (req, res) => res.json(score()));
router.post('/score', (req, res) => res.json(score(req.body || {})));
module.exports = router;
