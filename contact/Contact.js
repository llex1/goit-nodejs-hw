const mongoose = require("mongoose");
const ContactSchema = require("./Contact.schema");

class Contact {
  model = this.initModel();

  async initModel() {
    this.model = await mongoose.model("contact", ContactSchema);
  }
  getAll() {
    return this.model.find();
  }
  getById(contactId) {
    return this.model.findById(contactId);
  }
  addOne(obj) {
    return this.model.create(obj);
  }
  changeOne(contactId, obj) {
    return this.model.findByIdAndUpdate(contactId, obj, { new: true });
  }
  deleteOne(contactId) {
    return this.model.findByIdAndDelete(contactId);
  }
}

module.exports = new Contact();
