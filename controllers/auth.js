const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                err: "Invalid Request"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id,
            expenses: user.expenses,
            savings: user.savings,
            income: user.income,
            totalBalance: user.totalBalance
        });
    })
}

exports.signin = (req, res) => {
    const {email, password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "Email Not Found"
            })
        }
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Invalid Credentials"
            })
        }

        // Create Token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)

        // Put token in cookie
        res.cookie('token', token, {expire: new Date() + 9999});

        // Send response to front end
        const {_id, name, email, expenses, income, savings, totalBalance} = user;
        
        return res.json({token, user: {_id, name, email, expenses, income, savings, totalBalance}});
    })

}

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: "User signed out"
    });
}

// Protected Routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
})

// Custom Middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker) {
        return res.status(403).json({
            error: 'ACCESS DENIED'
        });
    }
    next();
}