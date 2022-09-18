const router = require('express').Router();
const categoryController = require('./category.controller');

router.post('/', verify, categoryController.post);
router.get('/', verify, categoryController.get);

module.exports = router;