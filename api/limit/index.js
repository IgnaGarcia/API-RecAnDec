const router = require('express').Router();
const limitController = require('./limit.controller');

router.post('/:id/limit', limitController.post);
router.get('/:id/limit', limitController.get);
router.put('/:id/limit/:limit', limitController.update);

module.exports = router;