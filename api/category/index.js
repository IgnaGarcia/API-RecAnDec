const router = require('express').Router();
const categoryController = require('./category.controller');
const { verify } = require('../../utils/auth.utils');

router.post('/', verify, categoryController.post);
router.get('/', verify, categoryController.get);

module.exports = router;