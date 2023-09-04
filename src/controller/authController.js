const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
    let errors = {}; // email, password

    // incorrect email (login)
    if (err.message.includes('incorrect email')) {
        errors.email = err.message;
    }
    if (err.message.includes('incorrect password')) {
        errors.password = err.message;
    }

    // duplicate element error code
    // the code of duplicate elements is 11000
    if (err.code === 11000)  {
        errors.email = 'This email has already been registered. Please enter another one.';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const threeDays = 3 * 24 * 60 * 60;
exports.secretKey = 'secret-key';
const createToken = (id) => {
    return jwt.sign({ id }, 'secret-key', { expiresIn: threeDays });
}

exports.get_signup = (req, res) => {
    res.render('signup');   
}

exports.post_signup = async (req, res) => {
    
    const { email, password } = req.body;
    try { 
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: threeDays * 1000 // milliseconds
        })
        return res.status(201).json({
            status: 201,
            data: user._id,
            message: 'user created successfully.'
        })
    } catch (err) {
        const errorObject = handleErrors(err);
        res.status(404).json({
            status: 404,
            message: errorObject
        })
    }
}

exports.get_login = (req, res) => {
    res.render('login');
}

exports.post_login = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: threeDays * 1000 // milliseconds
        })
        res.status(200).json({
            status: 200,
            data: user
        })
    } catch (err) {
        const errorObject = handleErrors(err);
        res.status(400).json({
            status: 400,
            message: errorObject
        })
    }
}

exports.get_logout = async (req, res) => {
    // you can't replace tokens from server, therefore we will
    // replace it with a blank cookie which has a pretty short
    // expiry time (1 ms)
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
