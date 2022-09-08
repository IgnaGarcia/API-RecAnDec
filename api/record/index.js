const router = require('express').Router();
const recordController = require('./record.controller');

router.post('/:id/record', recordController.post);

module.exports = router;