const mongoose = require("mongoose");
const userSchema = require("./User.schema");

class User {
  model = this.initModel();

  async initModel() {
    this.model = await mongoose.model("user", userSchema);
  }
  getByEmail(email) {
    return this.model.findOne({ email: email });
  }
  getById(id){
    return this.model.findById(id);
  }
  addOne(obj) {
    return this.model.create(obj);
  }
  updateOne(id, obj){
    return this.model.findByIdAndUpdate(id, obj, {new: true});
  }
}

module.exports = new User();
