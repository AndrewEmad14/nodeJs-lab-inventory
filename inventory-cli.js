//imports

const fs = require("fs");
const path = require("path");
const { createInterface } = require("node:readline/promises");

// creating interface to use input and output stram
const inputReader = createInterface({
    input: process.stdin,
    output: process.stdout,
});

// using path to work on different platfroms
const inventoryPath = path.join(__dirname, "inventory.json");

//taking arguments
const [, , command, args, modification] = process.argv;

//options for the command avialble
let options = [
    {
        command: "add",
        description: "adds item to the inventory",
    },
    {
        command: "list",
        description: "list items in the inventory",
    },
    {
        command: "destock",
        description: "reducing the quantity of an item given an id ",
    },
    {
        command: "restock",
        description: "reducing the quantity of an item given an id",
    },
    {
        command: "rename",
        description: "rename an item givven an id",
    },
    {
        command: "remove",
        description: "remove an item givven an id",
    },
    {
        command: "summary",
        description: "summary of the inventory",
    },
];

// check if the file exsists
fs.access(inventoryPath, (error) => {
    if (!error) {
        runCLI();
    } else {
        console.log("file not found");
        inputReader.close();
    }
});

/**
 * prompts the user input
 * @param {object[]}inventory the inventory you want to add the item to
 */
async function addItem(inventory) {
    const inputItemName = await inputReader.question("Item name: ");
    const inputQuantity = await inputReader.question("quantity: ");
    const inputCategory = await inputReader.question("category: ");

    const newId = inventory.length;
    const itemName = inputItemName ? inputItemName : "";
    const quantity = inputQuantity ? parseInt(inputQuantity) : 1;
    const category = inputCategory ? inputCategory : "General";
    let status;
    if (quantity > 2) {
        status = "available";
    } else if (quantity < 0) {
        status = "out of stock";
    } else {
        status = "low on stock";
    }
    const item = {
        id: newId,
        itemName: itemName,
        quantity: quantity,
        category: category,
        status: status,
    };
    const newinventory = inventory.concat(item);
    fs.writeFileSync(inventoryPath, JSON.stringify(newinventory));
    inputReader.close();
    console.log("Item added!");
}

/**
 * reducing the quantity of an item when stock is removed
 * @param {string}id - the id of the item you wish to destock
 * @param {string}modification - the amount you wish to destock
 * @param {object[]} inventory - a refrence of the inventory
 */
function deStock(id, modification, inventory) {
    const parsedId = parseInt(id);
    const parsedModification = parseInt(modification);
    const newinventory = inventory.map((item) => {
        if (item.id === parsedId && item.quantity - parsedModification >= 0) {
            item.quantity -= parsedModification;
        }
        return item;
    });
    console.log(newinventory);
    fs.writeFileSync(inventoryPath, JSON.stringify(newinventory));

    console.log("item destocked!");
    inputReader.close();
}
/**
 * increaseing the quantity of an item when stock is removed
 * @param {string}id - the id of the item you wish to destock
 * @param {string}modification - the amount you wish to destock
 * @param {object[]} inventory - a refrence of the inventory
 */
function reStock(id, modification, inventory) {
    const parsedId = parseInt(id);
    const parsedModification = parseInt(modification);
    const newinventory = inventory.map((item) => {
        if (item.id === parsedId) {
            item.quantity += parsedModification;
        }
        return item;
    });
    // console.log(newinventory);
    fs.writeFileSync(inventoryPath, JSON.stringify(newinventory));
    console.log("item restocked!");
    inputReader.close();
}
/**
 * rename an item in your inventory
 * @param {string}id - the id of the item you wish to rename
 * @param {string}modification - the new name
 * @param {object[]} inventory - a refrence of the inventory
 */
function rename(id, modification, inventory) {
    const parsedId = parseInt(id);
    const newinventory = inventory.map((item) => {
        if (item.id === parsedId) {
            item.itemName = modification;
        }
        return item;
    });
    // console.log(newinventory);
    fs.writeFileSync(inventoryPath, JSON.stringify(newinventory));
    console.log("item renamed!");
    inputReader.close();
}
/**
 * remove  an item in your inventory
 * @param {string}id - the id of the item you wish to rename
 * @param {object[]} inventory - a refrence of the inventory
 */
function removeItem(id, inventory) {
    //Todo: this is working incorrectly as the rest of the ids must be modified
    const parsedId = parseInt(id);
    const newinventory = inventory.filter((item) => item.id !== parsedId);
    // console.log(newinventory);
    fs.writeFileSync(inventoryPath, JSON.stringify(newinventory));
    console.log("item destocked");
    inputReader.close();
}
/**
 * list items in your inventory
 *
 * @param {object[]} inventory - a refrence of the inventory
 */
function printInventory(inventory) {
    for (item of inventory) {
        console.log(`
			item id: ${item.id}	
			item name: ${item.itemName}	
			item quantity: ${item.quantity}	
			item category: ${item.category}	
			item status: ${item.status}	
			`);
    }

    inputReader.close();
}
/**
 * gives summary of the inventory
 *
 * @param {object[]} inventory - a refrence of the inventory
 */
function printSummary(inventory) {
	const totalNumberOfItems= inventory.length
	let totalQuantityOfItem=0;
	let totalAvailableItems=0;
	let totalLowStockItems=0;
	let totalOutOfStockItems=0;
	inventory.forEach(item =>{
		totalQuantityOfItem+=item.quantity
		if(item.status === "available"){
			totalAvailableItems+=1;
		}else if(item.status === "low on stock"){
			totalLowStockItems+=1;
		}else{
			totalNumberOfItems+=1;
		}
	});

    console.log(`
			Total number of items : 	${totalNumberOfItems},
			Total Quantity of items: 	${totalQuantityOfItem},
			Total available items: 		${totalAvailableItems},
			Total low stock items: 		${totalLowStockItems},
			Total out of stock items: 	${totalOutOfStockItems},
			
			`);

    inputReader.close();
}

/**
 * runCLI
 *
 * runs the main program after doing the file check
 */
function runCLI() {
    const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf-8"));
    if (command === options.at(0).command) {
        addItem(inventory);
    } else if (command === options.at(1).command) {
        printInventory(inventory);
    } else if (command === options.at(2).command) {
        deStock(args, modification, inventory);
    } else if (command === options.at(3).command) {
        reStock(args, modification, inventory);
    } else if (command === options.at(4).command) {
        rename(args, modification, inventory);
    } else if (command === options.at(5).command) {
        removeItem(args, inventory);
    } else if (command === options.at(6).command) {
        printSummary(inventory);
    } else {
        printOptions();
    }
}

/**
 * print the avilable command options
 *
 *
 */
function printOptions() {
    console.log("Here are the available options:");
    for (const option of options) {
        console.log(`${option.command}		${option.description}`);
    }
    inputReader.close();
}
