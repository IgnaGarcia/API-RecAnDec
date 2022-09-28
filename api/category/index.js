const router = require('express').Router();
const categoryController = require('./category.controller');
<<<<<<< HEAD

router.post('/:id/category', categoryController.post);
router.get('/:id/category', categoryController.get);
=======
const { verify } = require('../../utils/auth.utils');

router.post('/', verify, categoryController.post);
router.get('/', verify, categoryController.get);
>>>>>>> auth-services

module.exports = router;