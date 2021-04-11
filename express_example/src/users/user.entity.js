const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { role } = require('../commons/util');


const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4,
    },

    password: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
    },

    role: {
        type: String,
        enum: [role.admin, role.customer],
        default: role.customer,
    },

    failedLogins: {
        type: Number,
        default: 0,
    
    },

    isBlocked: {
        type: Boolean,
        default: false,
    }



}, { collection: 'users' });

schema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync();
        this.password = bcrypt.hashSync(this.password, salt);
    }

    next();
})

module.exports = mongoose.model('User', schema);

