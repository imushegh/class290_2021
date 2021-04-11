const User = require('../users/user.entity');
const { Unauthorized, Locked } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async validate(username, password) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Unauthorized();
        }
        if (!bcrypt.compareSync(password, user.password)) {
            await User.updateOne({
                username: username
            }, {
                $inc: { failedLogins: 1 }
            });
            if (user.failedLogins >= 2) {
               
                await User.updateOne({
                    username: username
                }, {
                    $set: { isBlocked: true }
                });
                throw new Locked('The user is locked!');
            }
            throw new Unauthorized();
        }

// If there were fewer than 3 unsuccessful attempts, reset the counter on a successful
// log-in and do not lock the user.

        User.updateOne({
            username: username
        }, {
            $set: { failedLogins: 0, isBlocked: false }
        });


        return user;
    }

    async login(username, password) {
        const user = await this.validate(username, password);

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }
}

module.exports = new AuthService();