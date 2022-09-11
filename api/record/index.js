const router = require('express').Router();
const recordController = require('./record.controller');

router.post('/:id/record', recordController.post);
router.get('/:id/record', recordController.get);

router.get('/:id/record/balance', recordController.balance);
router.get('/:id/record/summary/:groupBy', recordController.summary);
router.get('/:id/record/historical', recordController.historical);

module.exports = router;