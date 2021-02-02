import { ContactsDemon } from "./contacts.js";

const Contacts = new ContactsDemon();

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      Contacts.listContacts();
      break;
    case "get":
      Contacts.getContactById(id);
      break;
    case "add":
      Contacts.addContact(name, email, phone);
      break;
    case "remove":
      Contacts.removeContact(id);
      break;
    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

//поки не розібрався як користуватися 'yargs' коли імпорт ES6
//швидше було написати данну функцію
const parsArgv = ((arr = process.argv) => {
  const dataOut = {};
  const step1 = arr.filter((el) => {
    return el[0] === "-";
  });
  const step2 = step1.map((el) => {
    const spl = el.split("=");
    spl[0] = spl[0].slice(2);
    return spl;
  });
  step2.forEach((el) => {
    dataOut[el[0]] = el[1];
  });
  return dataOut;
})();

invokeAction(parsArgv);
