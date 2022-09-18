const router = require('express').Router();
const tagController = require('./tag.controller');

router.post('/', verify, tagController.post);
router.get('/', verify, tagController.get);

module.exports = router;