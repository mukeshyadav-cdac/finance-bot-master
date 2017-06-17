const express = require('express');
const router = express.Router();
const apiV1Bank = require('./v1/bank.js');


router.post('/api/v1/getCategoryRecord', apiV1Bank.getCategoryRecord);
router.post('/api/v1/getWeeklyMonthly', apiV1Bank.getWeeklyMonthly);

module.exports = router;
