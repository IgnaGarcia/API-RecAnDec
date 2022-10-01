const router = require('express').Router();
const recordController = require('./record.controller');
const { verify } = require('../../utils/auth.utils')

router.post('/', verify, recordController.post);
router.get('/', verify, recordController.get);
router.put('/:record', verify, recordController.update);

router.get('/balance', verify, recordController.balance);
router.get('/summary/:groupBy', verify, recordController.summary);
router.get('/historical/:groupBy', verify, recordController.historical);

module.exports = router;