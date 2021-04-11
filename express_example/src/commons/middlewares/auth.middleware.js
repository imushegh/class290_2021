const { Forbidden } = require('http-errors');
const { validateToken } = require('../../auth/auth.service');
const users = require('../../users/users.service');

const jwtMiddleware = async (req, res, next) => {
    let token;
    try {
        token = req.header('Authorization').split(' ')[1];
        const user = validateToken(token);
        const dbUser = await users.findOne(user.userId);

        // 4. No authorized request done by a locked user should be allowed.

        if(dbUser.isBlocked){
            return next(new Forbidden());
        }
        user.role = dbUser.role;
        req.user = user;
    } catch (err) {
        return next(new Forbidden());
    }

    next();
}

jwtMiddleware.unless = require('express-unless');

module.exports = {
    jwtMiddleware
}