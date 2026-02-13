const http = require('http');
const fs = require('fs');
const path = require('path');

const routes = {
  INVENTORY: 'inventory',
  SERBAL_HTML: 'serbal.html',
  ASTRONOMY_HTML: 'astronomy.html',
  HOME_HTML: 'home.html',
  HOME_CSS: 'home.css',
  ASTRONOMY_JPG: 'astronomy.jpg',
  SERBAL_JPG: 'serbal.jpeg',
  PAGE_NOT_FOUND_HTML:'page-not-found.html'
};
const methods={
  GET:'GET',
  POST:'POST'
};
const types = {
  HTML_PAGE:'html',
  CSS_PAGE:'css'
};

//creating a server 
const server = http.createServer(async(req, res) => {
  const {method, url } = req;
  const params = url.split("/");



  if (method === methods.GET) {
    if (params.at(1) === routes.INVENTORY) {
      const filePath = path.join(__dirname,'public','data',`${routes.INVENTORY}.json`);
      if(params.at(2)){
        const id = parseInt(params.at(2));
        await getInventoryById(filePath,id,res);
      } else{
        await getInventory(filePath,res);
      }
    }else if(params.at(1)===routes.SERBAL_HTML){
      const  filePath= path.join(__dirname,'pages',routes.SERBAL_HTML);
      await getPage(filePath,res,types.HTML_PAGE);
    }else if(params.at(1)===routes.ASTRONOMY_HTML){
      const  filePath= path.join(__dirname,'pages',routes.ASTRONOMY_HTML);
      await getPage(filePath,res,types.HTML_PAGE);
    }else if(params.at(1)===routes.HOME_HTML){
      const  filePath= path.join(__dirname,'pages',routes.HOME_HTML);
      await getPage(filePath,res,types.HTML_PAGE);
    }else if( params.at(2) === routes.HOME_CSS) {
      const  filePath= path.join(__dirname,'style',routes.HOME_CSS);
      await getPage(filePath,res,types.CSS_PAGE);
    }else if(params.at(3)===routes.ASTRONOMY_JPG){
      const  filePath= path.join(__dirname,'public','images',routes.ASTRONOMY_JPG);
      await getImg(filePath,res);
    }else if(params.at(3)===routes.SERBAL_JPG){
      const  filePath= path.join(__dirname,'public','images',routes.SERBAL_JPG);
      await getImg(filePath,res);
    }else{
      const  filePath= path.join(__dirname,'pages',routes.PAGE_NOT_FOUND_HTML);
      await getPage(filePath,res,types.HTML_PAGE);
    }
  }else if(method === methods.POST){
    if(params.at(1)=== routes.INVENTORY){
      let body = '';
      req.on('data',chunk =>{
        body+= chunk.toString();
      });
      req.on('end',async ()=>{
        const postData = JSON.parse(body);
        const filePath = path.join(__dirname,'public','data',`${routes.INVENTORY}.json`);
        await addItem(postData,filePath,res);
      });
    }
  }
});
// listenting to the server
server.listen(80, () => {
  console.log('Up and running: http://127.0.0.1');
});

/**
 * @param {path} path- takes the path and use it to get the data from the file
 * @param {encoding} encoding -takes the desired encoding , by default its utf-8
 * @returns {Promise}- promise of the data
 */
function readFile(path,encoding = 'utf8'){
  return new Promise((resolve,reject)=>{
    const stream = fs.createReadStream(path,encoding);
    stream.on('error',reject);
    if(encoding){
      let data = '';
      stream.on('data',(chunk)=>{
        data+=chunk;
      });
      stream.on('end',()=>{
        resolve(data);
      });
    }else{
      const chunks = [];
      stream.on('data',(chunk)=>{
        chunks.push(chunk);
      });
      stream.on('end',()=>{
        const data = Buffer.concat(chunks);
        resolve(data);
      });
    }
    
  
  });
  
}
/**
 * prompts the user input
 * @param {object}postData - the data you want to add
 * @param {string} path - the path to your inventory
 * @param {Response} res -response of the server
 */
async function addItem(postData ,path,res) {
  try{
    const inventoryRaw = await readFile(path);
  
    const inventory = JSON.parse(inventoryRaw);
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
    res.writeHead(201,{'content-type': 'text/plain'});
    res.write("Data created successfully");

    res.end();

  }catch(error){
    res.writeHead(400,{'content-type': 'application/json'});
    res.write(JSON.stringify({error:error.message}));
    res.end();
  }
  
  
}
/**
 * get all the inventory
 * @param {string} path the inventory path
 * @param {Response} res the response of the server
 */
async function getInventory(path,res){
  const data = await readFile(path);
  const inventory = JSON.parse(data);
  const responseData = inventory;
  if(!responseData){
    const error = JSON.stringify({error:"no such file"});
    res.writeHead(404, {
      'content-type': 'application/json'
    });
    res.write(JSON.stringify(error));
  }else{
    res.writeHead(200, {
      'content-type': 'application/json'
    });
    res.write(JSON.stringify(responseData));
  }
  res.end();
}
/**
 * get an item by an id
 * @param {string} path 
 * @param {number} id 
 * @param {Response} res 
 */
async function getInventoryById(path,id,res){

  if(id){

    const data = await readFile(path);
    const inventory = JSON.parse(data);
    
    const responseData = inventory.find((item)=>item.id === id);
    if(!responseData){
      const error = JSON.stringify({error:"item not found"});
      res.writeHead(404, {
        'content-type': 'application/json'
      });
      res.write(error);

    }else{
      res.writeHead(200, {
        'content-type': 'application/json'
      });
      res.write(JSON.stringify(responseData));
    }
  }else{
    const error = JSON.stringify({error:"invalid input"});
    res.writeHead(400, {
      'content-type': 'application/json'
    });
    res.write(error);
          
  }
  res.end();
}
/**
 * gets an html or a css page
 * @param {string} path   -path of the page
 * @param {response} res  - response object form the http server
 * @param {string} type   - decide between html or css
 */
async function getPage(path,res,type){

  const content = await readFile(path);
  if(!content){
    res.writeHead(404, {'content-type': 'application/json'});
    const error = JSON.stringify({error:"page not found"});
    res.write(error);

  }else{
    res.writeHead(200, {
      'content-type': `text/${type}`
    });
    res.write(content);
  }
        
  res.end();
}
/**
 * get an image 
 * @param {string} path 
 * @param {response} res 
 */
async function getImg(path,res){
  const content = await readFile(path,null);
  if(!content){
    const error = JSON.stringify({error:"file not found"});
    res.writeHead(404, {
      'content-type': 'application/json'
    });
    res.write(error);

  }else{
    res.writeHead(200, {
      'content-type': 'image/jpeg'
    });
    res.write(content);
  }
  res.end();
}