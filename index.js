import express from "express";
import morgan from "morgan";
import cors from "cors";
import Joi from "joi";

import { ContactsDemon } from "./contacts.js";

const server = express();
const Contacts = new ContactsDemon();

const PORT = "8080";

server.use(morgan("dev"));
server.use(cors({ origin: "*" }));
server.use(express.json());

server.get("/api/contacts", (req, res) => {
  Contacts.listContacts().then((data) => {
    res.status(200).json(data);
  });
});

server.get("/api/contacts/:contactId", (req, res) => {
  Contacts.getContactById(req.params.contactId).then((data) => {
    switch (typeof data) {
      case "object":
        res.status(200).json(data);
        break;
      case "string":
        res.status(500).json(data);
        break;
      default:
        res.status(404).json({ message: "Not found" });
    }
  });
});

server.post("/api/contacts", (req, res) => {
  const checkJoi = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const checkResult = checkJoi.validate(req.body);

  checkResult.error
    ? res.status(400).json({ message: checkResult.error.message })
    : startAddContact(req.body);

  async function startAddContact({ name, email, phone }) {
    let dataOut = null;
    const result = await Contacts.addContact(name, email, phone);
    typeof result === "object"
      ? (dataOut = res.status(201).send(result))
      : (dataOut = res.status(500).send(result));
    return result;
  }
});

server.delete('/api/contacts/:contactId', (req, res)=> {
  Contacts.removeContact(req.params.contactId)
    .then(data => {
      data 
        ? res.status(200).json({"message": "contact deleted"})
        : res.status(404).json({"message": "Not found"})
    })
})

server.patch('/api/contacts/:contactId', async (req, res) => {
  if(JSON.stringify(req.body) === '{}' || !+req.params.contactId){
    res.status(400).json({"message": "missing fields"});
  } else {
    const checkJoi = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string()
    })
    const checkResult = checkJoi.validate(req.body)
    if(checkResult.error){
      res.status(400).json({"message": checkResult.error.message})
    } else {
      const result = await Contacts.updateContact(+req.params.contactId, req.body);
      if(!result) {
        res.status(404).json({"message": "Not found"});
      } else {
        res.status(200).json(result);
      }
    }
  }
})




server.listen(PORT, console.log("Server is running on port 8080"));
