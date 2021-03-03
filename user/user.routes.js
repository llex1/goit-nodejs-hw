const {Router} = require('express');
const userController = require('./user.controller');
const validate = require('../helpers/validate');

const userRouter = Router()

userRouter.get('/current', userController.current)
userRouter.patch('/', userController.updateSubsctiption)

module.exports = userRouter;