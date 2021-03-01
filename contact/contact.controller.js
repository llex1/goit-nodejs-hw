const contactModel = require("./Contact");

class ContactController {
  async getAll(req, res, next) {
    res.json(await contactModel.getAll());
  }
  async getById(req, res, next) {
    const { contactId } = req.params;
    res.json(await contactModel.getById(contactId));
  }
  async addOne(req, res, next) {
    res.json(await contactModel.addOne(req.body));
  }
  async changeOne(req, res, next) {
    const { contactId } = req.params;
    res.json(await contactModel.changeOne(contactId, req.body));
  }
  async deleteOne(req, res, next) {
    const { contactId } = req.params;
    res.json(await contactModel.deleteOne(contactId));
  }
}

module.exports = new ContactController();
