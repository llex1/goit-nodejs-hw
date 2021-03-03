const userModel = require('../user/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Auth{

  async register(req, res, next){
    const {email, password} = req.body;
    if(await userModel.getByEmail(email)){
      return res.status('409').json({"message": "Email in use"})
    }
    const hashPassword = await bcrypt.hash(password, 8)
    if((await userModel.addOne({email: email, password: hashPassword})).email === email){
      res.status('201').json({
        "user": {
            "email": email,
            "subscription": "free"
          }
      })
    }else{
      res.status('500').send('Sorry, we have some problem [au.c/r1]');
    }
  }
  async login(req, res, next){
    const {email, password} = req.body;
    const user = await userModel.getByEmail(email);
    if(!user){
      return res.status('401').send('Email or password is wrong');
    }
    const resultCompare = await bcrypt.compare(password, user.password);
    if(!resultCompare){
      return res.status('401').send('Email or password is wrong');
    }
    const newToken = jwt.sign({"userId": user._id}, process.env.JWT_SECRET);
    if((await userModel.updateOne(user._id, {token: newToken})).token === newToken){
      res.status('201').json({
        "token": newToken,
        "user": {
            "email": email,
            "subscription": "free"
          }
      })
    }else{
      res.status('500').send('Sorry, we have some problem [au.c/l1]');
    }
  }
  async logout(req, res, next){
    console.log(req.user);
    if((await userModel.updateOne(req.user.id, {token: ''})).email === req.user.email){
      res.status('204').send()
    }else{
      res.status('500').send('Sorry, we have some problem [au.c/l2]');
    }
  }



}


module.exports = new Auth()

// "token": "exampletoken",
//   "user": {
//     "email": "example@example.com",
//     "subscription": "free"
//   }