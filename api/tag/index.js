const router = require('express').Router();
const tagController = require('./tag.controller');

router.post('/:id/tag', tagController.post);
router.get('/:id/tag', tagController.get);

module.exports = router;