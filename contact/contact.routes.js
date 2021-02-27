const { Router } = require("express");
const contactController = require("./contact.controller");

const contactRouter = Router();

contactRouter.get("/", contactController.getAll);
contactRouter.get("/:contactId", contactController.getById);
contactRouter.post("/", contactController.addOne);
contactRouter.patch("/:contactId", contactController.changeOne);
contactRouter.delete("/:contactId", contactController.deleteOne);

module.exports = contactRouter;
