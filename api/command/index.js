const router = require('express').Router();
const commandController = require('./command.controller');

router.post('/:id/command', commandController.post);
router.get('/:id/command', commandController.get);
router.delete('/:id/command/:command', commandController.erase);

module.exports = router;