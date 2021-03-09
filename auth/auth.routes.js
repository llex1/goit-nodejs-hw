const {Router} = require('express');
const authController = require('./auth.controller');
const validate = require('../helpers/validate');

const authRouter = Router();

authRouter.post('/register', validate.registerLogin, authController.register)
authRouter.post('/login', validate.registerLogin, authController.login)
authRouter.post('/logout', validate.token, authController.logout)

module.exports = authRouter