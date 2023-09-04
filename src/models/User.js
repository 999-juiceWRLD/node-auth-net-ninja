const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Please provide a passport.'],
        minlength: [6, 'The password must have at minimum six characters.'],
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const isAuthTrue = await bcrypt.compare(password, user.password);
        if (isAuthTrue) {
            return user;
        }
        throw Error('incorrect password.');
    }

    throw Error('incorrect email.');
}

const User = mongoose.model('user', userSchema);
module.exports = User;
