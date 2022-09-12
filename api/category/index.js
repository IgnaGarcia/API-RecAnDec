const router = require('express').Router();
const categoryController = require('./category.controller');

router.post('/:id/category', categoryController.post);
router.get('/:id/category', categoryController.get);

module.exports = router;