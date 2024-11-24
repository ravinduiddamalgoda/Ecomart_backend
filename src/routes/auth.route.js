const UserController = require('../controller/user.ctrl');

const AuthRouter = require('express').Router();


AuthRouter.post('/login', UserController.loginUser);
AuthRouter.post('/verify', UserController.optFunc);

module.exports = AuthRouter;

