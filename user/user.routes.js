const {Router} = require('express');
const userController = require('./user.controller');
const validate = require('../helpers/validate');

const userRouter = Router()

userRouter.get('/current', userController.current)
userRouter.patch('/', userController.updateSubsctiption)
userRouter.patch('/avatars', userController.upload ,userController.updateAvatar)

module.exports = userRouter;