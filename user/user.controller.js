const userModel = require('./User');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises')

class userController{

  #upload = multer({ dest: './tmp/' })
  
  upload = this.#upload.single('avatar')
  
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

  async updateAvatar(req, res, next){
    const {_id} = req.user;
    const fileExtension = (path.parse(req.file.originalname)).ext
    const currentAvatarName = req.user.avatarURL.replace(process.env.AVATAR_PATH, '')
    let dbRes;
    try{
      await fs.copyFile(`${req.file.path}`, `./public/images/${req.file.filename}${fileExtension}`);
      dbRes = await userModel.updateOne(_id, {"avatarURL": `${process.env.AVATAR_PATH}${req.file.filename}${fileExtension}`})
      if(dbRes.avatarURL === `${process.env.AVATAR_PATH}${req.file.filename}${fileExtension}`){
      await fs.rm(`${req.file.path}`)
      await fs.rm(`./public/images/${currentAvatarName}`)        
      }else{
        return res.status('500').send('Sorry, we have some problem [us.c/u2]')
      }
    }catch(err){
      return res.status('500').send('Sorry, we have some problem [us.c/u3]')
    }
    res.json({"avatarURL": `${dbRes.avatarURL}`})
    next()
  }
}

module.exports = new userController()
