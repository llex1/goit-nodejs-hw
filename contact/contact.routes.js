const { Router } = require("express");
const contactController = require("./contact.controller");
const validate = require('../helpers/validate');

const contactRouter = Router();

contactRouter.get("/", contactController.getAll);
contactRouter.get("/:contactId", validate.id, contactController.getById);
contactRouter.post("/", contactController.addOne);
contactRouter.patch("/:contactId", validate.id, validate.email, contactController.changeOne);
contactRouter.delete("/:contactId", validate.id, contactController.deleteOne);

module.exports = contactRouter;
