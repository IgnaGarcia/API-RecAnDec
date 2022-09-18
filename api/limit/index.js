const router = require('express').Router();
const limitController = require('./limit.controller');

router.post('/', verify, limitController.post);
router.get('/', verify, limitController.get);
router.put('/:limit', verify, limitController.update);
router.delete('/:limit', verify, limitController.erase);

module.exports = router;