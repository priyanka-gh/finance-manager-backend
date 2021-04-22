const express = require('express');
const router = express.Router();
const {getUserById, pushIntoExpenseList, modifyTotalBalance, pushIntoIncomeList, pushIntoBankList} = require('../controllers/user');

router.param('userId', getUserById);

router.post('/expense/add/:userId', modifyTotalBalance, pushIntoExpenseList);
router.post('/income/add/:userId', modifyTotalBalance, pushIntoIncomeList);

module.exports = router;