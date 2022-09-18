const router = require('express').Router();
const telegramController = require('./telegram.controller');

router.post('/:telegramId', telegramController.sync);
router.get('/:telegramId/wallets', telegramController.wallets);
router.get('/:telegramId/categories', telegramController.categories);
router.get('/:telegramId/tags', telegramController.tags);

module.exports = router;