const router = require('express').Router();
const commandController = require('./command.controller');
const { verify } = require('../../utils/auth.utils');

router.post('/', verify, commandController.post);
router.get('/', verify, commandController.get);
router.delete('/:command', verify, commandController.erase);

module.exports = router;