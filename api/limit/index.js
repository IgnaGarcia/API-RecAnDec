const router = require('express').Router();
const limitController = require('./limit.controller');

router.post('/:id/limit', limitController.post);
router.get('/:id/limit', limitController.get);

module.exports = router;