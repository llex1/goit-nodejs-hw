import { promises as fsPromises } from "fs";
import path from "path";
import { fileURLToPath } from "url";

//побічний ефект використання імпорту ES6
const __filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filePath);

const contactsPath = path.join(__dirname, "/db/contacts.json");

class ContactsDemon {
  #filepath = contactsPath;

  data = [];
  dataLength = 0;
  error = "";
  timers = {
    error: null,
    delayServer: null,
  };
  //імітація затримки сервера [stage 1]
  //  delayServer = ()=> {return new Promise((res, rej)=>{
  //   this.timers.delayServer = setTimeout(()=>{
  //     res(['oK_'])
  //   }, 3000)
  // })}

  //допоміжна функція для читання файлу
  getFile = async () => {
    try {
      this.timers.error = setTimeout(() => {
        try {
          throw new Error();
        } catch (err) {
          this.error = "server is busy";
        }
      }, 2000);
      //імітація затримки сервера [stage 2]
      // const delayServerResponse = await this.delayServer()
      // this.data = [...delayServerResponse]
      await fsPromises
        .readFile(this.#filepath, "utf-8")
        .then((data) => JSON.parse(data))
        .then((json) => (this.data = [...json]));
      this.dataLength = this.data.length;
      clearTimeout(this.timers.error);
    } catch (err) {
      this.error = err.message;
      clearTimeout(this.timers.error);
      return false;
    }
    return true;
  };

  //допоміжна функція для перезапису файлу
  rewriteFile = async (str) => {
    const prevDataLength = this.dataLength;
    await fsPromises.writeFile(this.#filepath, str);
    if ((await this.getFile()) && !this.error) {
    } else {
      console.log(this.error);
    }
    const dataOut =
      prevDataLength != this.data.length
        ? "Файл перезаписано"
        : "Помилка запису файла";
    return dataOut;
  };

  listContacts = async () => {
    if ((await this.getFile()) && !this.error) {
      console.table(this.data);
    } else {
      console.log(this.error);
    }
  };

  getContactById = async (contactId) => {
    if ((await this.getFile()) && !this.error) {
      const dataOut = this.data.filter((el) => {
        return el.id == contactId;
      });
      dataOut.length
        ? console.table(dataOut)
        : console.log(`Перепрошую, під ID [${contactId}] запис не знайдено`);
    } else {
      console.log(this.error);
    }
  };

  removeContact = async (contactId) => {
    if ((await this.getFile()) && !this.error) {
      const findIdx = this.data.findIndex((el) => el.id == contactId);
      if (findIdx < 0) {
        console.log(`Перепрошую, під ID [${contactId}] запис не знайдено`);
      } else {
        const contact = JSON.stringify(this.data[findIdx]);
        this.data.splice(findIdx, 1);
        console.log(`Запис ${contact} видалено`);
        console.log(await this.rewriteFile(JSON.stringify(this.data)));
      }
    } else {
      console.log(this.error);
    }
  };

  addContact = async (name, email, phone) => {
    if ((await this.getFile()) && !this.error) {
      //щоб не брати відносно довжини, так як довжину будемо змінювати
      const createNewId = +this.data[this.data.length - 1].id + 1;
      const createNewData = [
        ...this.data,
        {
          id: createNewId,
          name,
          email,
          phone,
        },
      ];
      console.log(await this.rewriteFile(JSON.stringify(createNewData)));
      console.log(`Зипису було присвоєно ID [${createNewId}]`);
    } else {
      console.log(this.error);
    }
  };
}

export { ContactsDemon };
