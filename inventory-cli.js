// /**
//  * imports
//  */

// /**
//  *  reading from a file
//  */

// /**
//  * processing arguments
//  */
// const [, , command] = process.argv;

// /**
//  *  running the cli , the function is asyn because it should wait for the user input
//  */

// console.log("what is your name");
// rl.on("line", (answer) => {
//     console.log(answer.concat(" is a great name"));
//     rl.close();
// });
// console.log("what now");

// const ac = new AbortController();
// const signal = ac.signal;

// signal.addEventListener('abort', () => {
//   console.log('The  question timed out');
// }, { once: true });

// setTimeout(() => ac.abort(), 10000);

//imports

const fs = require("fs");
const path = require("path");
const { createInterface } = require("node:readline/promises");

const inventoryPath = path.join(__dirname, "invntory.json");

fs.access(inventoryPath, (error) => {
  if (!error) {
    const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf-8"));
    if (command === "add") {
      addItem(inventory);
    } else if (command === "list") {
      console.log("Current Inventory:");
      console.log(inventory);
    } else {
      inputReader.close();
    }
  } else {
    console.log("file not found");
    inputReader.close();
  }
});
const inputReader = createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * prompts the user input
 *
 */
async function addItem(inventory) {
  const itemName = await inputReader.question("Item name: ");
  const quantity = await inputReader.question("quantity: ");
  const category = await inputReader.question("category: ");
  const newId = inventory.length + 1;
  const item = {
    id: newId,
    itemName: itemName,
    quantity: quantity,
    category: category,
  };
  const newinventory = inventory.concat(item);
  fs.writeFileSync(inventoryPath, JSON.stringify(newinventory));
  inputReader.close();
}

const [, , command] = process.argv;
