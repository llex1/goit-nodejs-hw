const {
  Types: { ObjectId },
} = require("mongoose");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const userModel = require('../user/User');

class Validate {
  id(req, res, next) {
    const keyId = Object.keys(req.params).find((el) => {
      return el.slice(el.length - 2).toLocaleLowerCase() === "id";
    });
    if (!ObjectId.isValid(req.params[keyId])) {
      return res.status("400").send("id not valide");
    }
    next();
  }
  email(req, res, next) {
    const joiSchema = Joi.object({
      email: Joi.string().email(),
    }).unknown();
    if (!!req.body.email & !!joiSchema.validate(req.body).error) {
      return res.status("400").send(joiSchema.validate(req.body).error.message);
    }
    next();
  }
  registerLogin(req, res, next){
    const joiSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    }).unknown()
    if (!!joiSchema.validate(req.body).error) {
      return res.status("400").send(joiSchema.validate(req.body).error.message);
    }
    next();
  }
  async token(req, res, next){
    const token = req.get('Authorization').replace('Bearer ', '');
    let tokenPayload;
    try{
      tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
    }catch(err){
      return res.status('401').json({
        "message": "Not authorized"
      })
    }
    req.user = await userModel.getById(tokenPayload.userId);
    if(!req.user){
      return res.status('401').json({
        "message": "Not authorized"
      })
    }
    next();
  }
}

module.exports = new Validate();