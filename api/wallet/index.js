const router = require('express').Router();
const walletController = require('./wallet.controller');
const { verify } = require('../../utils/auth.utils');

router.post('/', verify, walletController.post);
router.get('/', verify, walletController.get);

module.exports = router;