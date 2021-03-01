const {Schema} = require('mongoose');
// const {Types:{ObjectId}} = require('mongoose');

module.exports = new Schema({
  name: String,
  email: {
    type: String,
    require: true,
    validate: (val)=>{return val.includes('@')}
  },
  phone: String,
  subscription: String,
  password: String,
  token: String
})

