const router = require('express').Router();
const recordController = require('./record.controller');

router.post('/:id/record', recordController.post);
router.get('/:id/record', recordController.get);

module.exports = router;