const router = require('express').Router();
const commandController = require('./command.controller');

router.post('/', verify, commandController.post);
router.get('/', verify, commandController.get);
router.delete('/:command', verify, commandController.erase);

module.exports = router;