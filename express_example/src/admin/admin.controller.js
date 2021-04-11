const express = require('express');
const router = express.Router();
const users = require('../users/users.service');
const asyncHandler = require('express-async-handler');
const { role } = require("../commons/util");
const { Unauthorized } = require('http-errors');


// Only admins can unlock users, hence return status code 403 if the authorized user
// is not an admin with the message: “Not authorized!”.
// If the token is valid and the user is an admin, unlock the given user by resetting
// the corresponding fields and return the status code 200 with the message “User has successfully been unlocked!”.

router.patch('/unlock-user/:id/', asyncHandler(async (req, res) => {
    if (!req.user || !req.user.role || req.user.role !== role.admin) {
        throw new Unauthorized('Not authorized!');
    }
    const { id } = req.params;
    await users.update(id, { failedLogins: 0, isBlocked: false});

    res.status(200).send({ message: "User has successfully been unlocked!" });
}))


router.patch('/lock-user/:id/', asyncHandler(async (req, res) => {
    if (!req.user || !req.user.role || req.user.role !== role.admin) {
        throw new Unauthorized('Not authorized!');
    }
    const { id } = req.params;
    await users.update(id, { failedLogins: 3, isBlcoked: true });

    res.status(200).send({ message: "User has successfully been locked!" });
}))

module.exports = router;