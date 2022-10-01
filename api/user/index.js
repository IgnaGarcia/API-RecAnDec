const router = require('express').Router();
const userController = require('./user.controller');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id/refresh', userController.refreshToken);

module.exports = router;