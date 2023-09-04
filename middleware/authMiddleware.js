const jwt = require('jsonwebtoken')
const { secretKey } = require('../controller/authController')
const User = require('../models/User')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    const tokens = req.cookies;

    console.log(token);
    console.log(tokens);

    // check if json web token exists
    if (token) {
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

// check current user

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (token) {
        jwt.verify(token, secretKey, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id)
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser }
