const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const contactSchema = require("./Contact.schema");

contactSchema.plugin(mongoosePaginate);

class Contact {
  model = this.initModel();

  async initModel() {
    this.model = await mongoose.model("contact", contactSchema);
  }
  getAll(obj) {
    if (obj) {
      return this.model.paginate({}, obj);
    }
    return this.model.find();
  }
  getAllBySubscription(param) {
    return this.model.find({ subscription: { $eq: param } });
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
