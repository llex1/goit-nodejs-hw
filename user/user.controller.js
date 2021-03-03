const userModel = require('./User');

class userController{

  current(req, res, next){
    res.status('200').json({
      email: req.user.email,
      subscription: req.user.subscription
    })
    next()
  }
  async updateSubsctiption(req, res, next){
    const {subscription} = req.body
    const acceptableOptions = ['free', 'pro', 'premium'];
    if(acceptableOptions.includes(subscription)){
       const result = await userModel.updateOne(req.user._id, {subscription: subscription})
       if(result.subscription === subscription){
         res.status('200').send('New subscription accepted!')
       }else{
         res.status('500').send('Sorry, we have some problem [us.c/u1]')
       }
    }else{
      res.status('400').send('Check your query params.')
    }
    next()
  }
}

module.exports = new userController()
