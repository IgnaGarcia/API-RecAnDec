const router = require('express').Router();
const walletController = require('./wallet.controller');

router.post('/:id/wallet', walletController.post);
router.get('/:id/wallet', walletController.get);

module.exports = router;