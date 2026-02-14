const fs = require("fs");

/**
 * get all the product items
 * @param {string} path the product path
 * @param {Response} res the response of the server
 * @returns {Promise} returns all the products
 */
function getproduct(path){
  return new Promise((resolve,reject)=>{
    const source =  fs.createReadStream(path);
    let data = '';
    source.on('data',(chunk)=>{
      data+=chunk;
    });
    source.on('end',()=>{
      const parsedData = JSON.parse(data);
      resolve(parsedData);
    });
    source.on('error',(error)=>reject(error));
  });

}

/**
 * get an product item by id
 * @param {string} path the product path
 * @param {number} id target item id
 * @returns {Promise} returns the item if found 
 */
function getproductById(path,id){
  return new Promise((resolve,reject)=>{
    const source =  fs.createReadStream(path);
    let data = '';
    source.on('data',(chunk)=>{
      data+=chunk;
    });
    source.on('end',()=>{
      const parsedData = JSON.parse(data);
      const item = parsedData.find((item)=>item.id === id);
      resolve(item);
    });
    source.on('error',(error)=>reject(error));
  });

}

/**
 * gets an html page
 * @param {string} path   -path of the page
 * @param {response} res  - response object form the http server
 * @returns {Promise} the read file
 */
function getPage(path){
  return new Promise((resolve,reject)=>{
    fs.readFile(path,(error,data)=>{
      if(error){
        reject(error);
      }else{
        resolve(data);
      }
    });
  });
    
}

/**
 * prompts the user input
 * @param {string} path - the path to your product
 * @param {JSON} body the body of the request
 * @return {Promise} status
 */
function addItem(path,body) {
  return new Promise((resolve,reject)=>{
    const source =  fs.createReadStream(path);
    let data = '';
    source.on('data',(chunk)=>{
      data+=chunk;
    });
    source.on('end',()=>{
      const product = JSON.parse(data);
      const postData = body;
      const lastItem = product.at(-1);
      const newId = (lastItem ? lastItem.id : 0  )+ 1;
      const itemName =  postData.itemName ;
      const quantity = postData.quantity ? parseInt(postData.quantity) : 1;
      const category = postData.category ? postData.category  : "General";
      const item = {
        id: newId,
        itemName: itemName,
        quantity: quantity,
        category: category,
      };
      const newproduct = product.concat(item);
      const writeStream = fs.createWriteStream(path);
      writeStream.write(JSON.stringify(newproduct));
      writeStream.end();
      resolve(201);
    });
    source.on('error',(error)=>{
      reject(error);
    });
  });
  
  
}

/**
 * remove an item from the product
 * @param {string} path - product path
 * @param {number} id - the item id you wish to remove
 * @return {Promise} returns the status of the removal
 */

function removeItem(path,id){
  return new Promise((resolve,reject)=>{
    const source =  fs.createReadStream(path);
    let data = '';
    source.on('data',(chunk)=>{
      data+=chunk;
    });
    source.on('end',()=>{
      const product = JSON.parse(data);
      const responseData = product.filter((item)=>item.id !== id);
      const writeStream = fs.createWriteStream(path);
      writeStream.write(JSON.stringify(responseData));
      writeStream.end();
      resolve(202);
    });
    source.on('error',(error)=>{
      reject(error);
    });
  });
}

/**
 * patch a product
 * @param {string} path - product path
 * @param {JSON}  body - request body
 * @param {number} id -the item you wish to patch
 * @return {Promise} - status of the patch
 */
function patchItem(path,body,id){
  return new Promise((resolve,reject)=>{
    const source =  fs.createReadStream(path);
    let data = '';
    source.on('data',(chunk)=>{
      data+=chunk;
    });
    source.on('end',()=>{
      const product = JSON.parse(data);
     
      const updatedItem = product.find((item)=>item.id === id);
      const patchData = body;
      if(updatedItem){
        updatedItem.itemName = patchData.itemName;
        updatedItem.quantity = patchData.quantity;
        updatedItem.category = patchData.category;
        const writeStream = fs.createWriteStream(path);
        writeStream.write(JSON.stringify(product));
        writeStream.end();
        resolve(202);
      }else{
        reject(404);
      }
      
    
    });
    source.on('error',(error)=>{
      reject(error);
    });
  });
}

/**
 * destock a product
 * @param {string} path - product path
 * @param {number} quantity -the quantity you want to remove
 * @param {number} id -the item you wish to patch
 * @return {Promise} - status of the patch
 */
function destockItem(path,quantity,id){
  return new Promise((resolve,reject)=>{
    const source =  fs.createReadStream(path);
    let data = '';
    source.on('data',(chunk)=>{
      data+=chunk;
    });
    source.on('end',()=>{
      
      const product = JSON.parse(data);
      const responseData = product;
      const updatedItem = product.find((item)=>item.id === id);
      if(updatedItem){
        if(updatedItem.quantity-quantity<0){
          reject("YOU CANT HAVE AN ITEM WITH NEGATIVE QUANTITY");
        }else{
          updatedItem.quantity -= quantity;
          const writeStream = fs.createWriteStream(path);
          writeStream.write(JSON.stringify(responseData));
          writeStream.end();
          resolve(202);
        }
       
      }else{
        reject("ITEM NOT FOUND");
      }
    
    });
    source.on('error',(error)=>{
      reject(error);
    });
  });
}


/**
 * restock a product
 * @param {string} path - product path
 * @param {number}  quantity - quantity you wish to add
 * @param {number} id -the item you wish to patch
 * @return {Promise} - status of the patch
 */
function restockItem(path,quantity,id){
  return new Promise((resolve,reject)=>{
    const source =  fs.createReadStream(path);
    let data = '';
    source.on('data',(chunk)=>{
      data+=chunk;
    });
    source.on('end',()=>{
      
      const product = JSON.parse(data);
      const responseData = product;
      const updatedItem = product.find((item)=>item.id === id);
      if(updatedItem){
        updatedItem.quantity += quantity;
        const writeStream = fs.createWriteStream(path);
        writeStream.write(JSON.stringify(responseData));
        writeStream.end();
        resolve(202);
      }else{
        reject("ITEM NOT FOUND");
      }
    
    });
    source.on('error',(error)=>{
      reject(error);
    });
  });
}

module.exports = {getproduct,getPage,getproductById,addItem,patchItem,removeItem,restockItem,destockItem};