const router = require('express').Router();
const tagController = require('./tag.controller');
const { verify } = require('../../utils/auth.utils');

router.post('/', verify, tagController.post);
router.get('/', verify, tagController.get);

module.exports = router;