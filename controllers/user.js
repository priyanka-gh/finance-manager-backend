const User = require('../models/user');

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'No user for was found in DB'
            })
        }
        req.profile = user;
        next();
    })
}

exports.modifyTotalBalance = (req, res, next) => {
    let expenseAmount = req.body.expense?.amount;
    let incomeAmount = req.body.income?.amount;
    let netWorthChange = 0;
    if(expenseAmount) {
        netWorthChange -= expenseAmount;
    }
    if(incomeAmount) {
        netWorthChange += incomeAmount;
    }
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$inc : {'totalBalance' : netWorthChange}},
        (err, result) => {
            if(err) {
                return res.status(400).json({
                    error: 'Some error occurred!'
                })
            }
            next();
        }
    )
}

exports.pushIntoIncomeList = (req, res) => {
    let income = req.body.income;
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {income: income}},
        {new: true},
        (err, result) => {
            if(err) {
                return res.status(400).json({
                    error: 'Unable to add expense'
                })
            }
            return res.status(200).json(result);
        }
    )
}

exports.pushIntoExpenseList = (req, res) => {
    let expenses = req.body.expense;
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {expenses: expenses}},
        {new: true},
        (err, result) => {
            if(err) {
                return res.status(400).json({
                    error: 'Unable to add expense'
                })
            }
            return res.status(200).json(result);
        }
    )
}
