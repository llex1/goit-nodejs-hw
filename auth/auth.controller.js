//npm module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createSvgAvatar = require("@multiavatar/multiavatar");
const fs = require("fs/promises");
const sgMail = require('@sendgrid/mail');
const {v4: uuidv4} = require('uuid')
//app module
const userModel = require("../user/User");

class Auth {
  async register(req, res, next) {
    const { email, password } = req.body; 
    if (await userModel.getByEmail(email)) {
      return res.status("409").json({ message: "Email in use" });
    }
    const avatarCode = createSvgAvatar(email);
    const avatarFileName = `${Date.now()}.svg`;
    const avatarPath = `${process.env.AVATAR_PATH}${avatarFileName}`;
    try {
      await fs.writeFile(
        __dirname + `/../public/images/${avatarFileName}`,
        avatarCode
      );
    } catch (err) {
      return res.status("500").send("Sorry, we have some problem [au.c/r1]");
    }
    const hashPassword = await bcrypt.hash(password, 8);
    const newVerificationToken = uuidv4();
    if (
      (
        await userModel.addOne({
          email: email,
          password: hashPassword,
          avatarURL: avatarPath,
          verificationToken: newVerificationToken
        })
      ).email === email
    ) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      const msg = {
        to: `${email}`,
        from: `${process.env.SENDGRID_SENDER_EMAIL}`,
        subject: 'Account Verification',
        // text: 'Please confirm your email address by clicking the link below',
        html: `
        <div >
          <p style="margin-bottom: 2em; font-size: 1.5em;">Please confirm your email address by clicking the link below</p>
          <a style="text-decoration:none; color: ghostwhite; background-color: dodgerblue; padding: 1em; border-radius: 6px; margin-bottom: 1em;" href="${process.env.SENDGRID_VERIFY_PATH}${newVerificationToken}">Verify your email address</a>
        </div>`,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
      res.status("201").json({
        user: {
          email: email,
          subscription: "free",
        },
      });
    } else {
      res.status("500").send("Sorry, we have some problem [au.c/r2]");
    }
  }
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await userModel.getByEmail(email);
    if (!user) {
      return res.status("401").send("Email or password is wrong");
    }
    const resultCompare = await bcrypt.compare(password, user.password);
    if (!resultCompare) {
      return res.status("401").send("Email or password is wrong");
    }
    const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    if (
      (await userModel.updateOne(user._id, { token: newToken })).token ===
      newToken
    ) {
      res.status("201").json({
        token: newToken,
        user: {
          email: email,
          subscription: "free",
        },
      });
    } else {
      res.status("500").send("Sorry, we have some problem [au.c/l1]");
    }
  }
  async logout(req, res, next) {
    if (
      (await userModel.updateOne(req.user.id, { token: "" })).email ===
      req.user.email
    ) {
      res.status("204").send();
    } else {
      res.status("500").send("Sorry, we have some problem [au.c/l2]");
    }
  }
  async verificationToken(req, res, next){
    const {verificationToken} = req.params
    if(await userModel.findOneAndUpdate({"verificationToken":{$eq: verificationToken}}, {"verificationToken":""})){
      return res.status('200').send('oK_')
    }else{
      return res.status('404').send('User not found')
    }
    next()
  }
}
module.exports = new Auth();
