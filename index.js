//imports
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');


//enums & constants
const routes = {
  INVENTORY: 'inventory',
  SERBAL_HTML: 'serbal.html',
  ASTRONOMY_HTML: 'astronomy.html',
  HOME_HTML: 'home.html',
  PAGE_NOT_FOUND_HTML:'page-not-found.html'
};
const types = {
  HTML_PAGE:'html',
  CSS_PAGE:'css',
  JSON:'json'
};
const folders={
  PUBLIC:'public',
  DATA:'data',
  IMAGES:'images',
  STYLE:'style',
  PAGES:'pages'
};
const PORT = 80;

// ask for  traversal attacks

//uses the public folder statically
app.use(express.static(folders.PUBLIC));

// for parsing application/json requests
app.use(express.json());          

app.get(`/${routes.INVENTORY}/:inventoryId`,  (req,res)=>{
  const filePath = path.join(__dirname,folders.PUBLIC,folders.DATA,`${routes.INVENTORY}.json`);
  const id = req.params.inventoryId;


  getInventoryById(filePath,res,parseInt(id));
  

});
app.get(`/${routes.INVENTORY}`,  (req,res)=>{
  const filePath = path.join(__dirname,folders.PUBLIC,folders.DATA,`${routes.INVENTORY}.json`);
  
  getInventory(filePath,res);
  

});
app.get(`/${routes.HOME_HTML}`,  (req,res)=>{
  const filePath = path.join(__dirname,folders.PAGES,`${routes.HOME_HTML}`);
  getPage(filePath,res);
});
app.get(`/${routes.ASTRONOMY_HTML}`,  (req,res)=>{
  const filePath = path.join(__dirname,folders.PAGES,`${routes.ASTRONOMY_HTML}`);
  getPage(filePath,res);
});
app.get(`/${routes.SERBAL_HTML}`,  (req,res)=>{
  const filePath = path.join(__dirname,folders.PAGES,`${routes.SERBAL_HTML}`);
  getPage(filePath,res);
});
app.get(`/${routes.PAGE_NOT_FOUND_HTML}`,  (req,res)=>{
  const filePath = path.join(__dirname,folders.PAGES,`${routes.PAGE_NOT_FOUND_HTML}`);
  getPage(filePath,res);
});

app.post(`/${routes.INVENTORY}`,(req,res)=>{
  const filePath = path.join(__dirname,folders.PUBLIC,folders.DATA,`${routes.INVENTORY}.json`);
  addItem(filePath,req,res);
});





app.listen(PORT,()=>{
  console.log(`Example app listening on port ${PORT}`);
});

/**
 * get all the inventory items
 * @param {string} path the inventory path
 * @param {Response} res the response of the server
 */
function getInventory(path,res){
  const source =  fs.createReadStream(path);
  res.type(types.JSON);
  pipeline(source,res,(err) => {
    if (err) {
      res.set( 'Content-Type','text/plain' );
      res.status(500).send('Streaming error');
    }
  });

}
/**
 * get an inventory item by id
 * @param {string} path the inventory path
 * @param {Response} res the response of the server
 * @param {number} id target item id
 */
function getInventoryById(path,res,id){
  const source =  fs.createReadStream(path);
  let data = '';
  source.on('data',(chunk)=>{
    data+=chunk;
  });
  source.on('end',()=>{
    const parsedData = JSON.parse(data);
    const item = parsedData.find((item)=>item.id === id);
    res.json(item);
  });
}

/**
 * gets an html page
 * @param {string} path   -path of the page
 * @param {response} res  - response object form the http server
 */
function getPage(path,res){
  const source =  fs.createReadStream(path);
  res.type(types.HTML_PAGE);
  pipeline(source,res,(err) => {
    if (err) {
      res.set( 'Content-Type','text/plain' );
      res.status(500).send('Streaming error');
    }
  });
  
}

/**
 * prompts the user input
 * @param {string} path - the path to your inventory
 * @param {Request} req - request to the sever
 * @param {Response} res -response of the server
 */
function addItem(path,req,res) {
  try{
    const source =  fs.createReadStream(path);
    let data = '';
    source.on('data',(chunk)=>{
      data+=chunk;
    });
    source.on('end',()=>{
      try{

      
        const inventory = JSON.parse(data);
        const postData = req.body;
        const lastItem = inventory.at(-1);
        const newId = (lastItem ? lastItem.id : 0  )+ 1;
        if(!postData.itemName){
          throw new Error("you must enter a name");
        }
        const itemName =  postData.itemName ;
        if(postData.quantity<0){
          throw new Error("cant put negative quantity");
        }else if(postData.quantity && isNaN(Number(postData.quantity))){
          throw new Error("quantity must be a number");
        }

        const quantity = postData.quantity ? parseInt(postData.quantity) : 1;
        const category = postData.category ? postData.category  : "General";
        const item = {
          id: newId,
          itemName: itemName,
          quantity: quantity,
          category: category,
        };

        const newinventory = inventory.concat(item);
        const writeStream = fs.createWriteStream(path);
        writeStream.write(JSON.stringify(newinventory));
        writeStream.end();
        res.status(201).send("Item Added successfully");
      }catch(error){
        res.status(400).json({error:error.message});
      }
    });
  }catch(error){
    res.status(400).json({error:error.message});
  }
}