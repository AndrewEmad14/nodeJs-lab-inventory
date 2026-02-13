const http = require('http');
const fs = require('fs');
const path = require('path');
// const inventoryCLI = require('./inventory-cli');

//creating a server 
const server = http.createServer(async(req, res) => {
  const {method, url } = req;
  const params = url.split("/");

  let error = "";

  if (method === 'GET') {
    if (params.at(1) === 'inventory') {
      try{
        let responseData ;
        if(params.at(2)){
        
          const id = parseInt(params.at(2));
        
          if(id){
            const filePath = path.join(__dirname,'public','data','inventory.json');
            const data = await readFile(filePath);
            const inventory = JSON.parse(data);
            responseData = inventory.find((item)=>item.id === id);
            if(!responseData){
              error = JSON.stringify({error:"item not found"});
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
            error = JSON.stringify({error:"invalid input"});
            res.writeHead(400, {
              'content-type': 'application/json'
            });
            res.write(error);
          
          }
          res.end();
        }else{
          const filePath = path.join(__dirname,'public','data','inventory.json');
          const data = await readFile(filePath);
          const inventory = JSON.parse(data);
          responseData = inventory;
          if(!responseData){
            error = JSON.stringify({error:"no such file"});
            res.writeHead(404, {
              'content-type': 'application/json'
            });
            res.write(JSON.stringify(responseData));
          }else{
            res.writeHead(200, {
              'content-type': 'application/json'
            });
            res.write(JSON.stringify(responseData));
          }
          res.end();
        }
        
      }catch(error){
        res.writeHead(500, {'content-type': 'application/json'});
        res.write(JSON.stringify({error:error}));
        res.end();
      }
    
    }else if(params.at(1)==="serbal.html"){
      try{
        const  filePath= path.join(__dirname,'pages','serbal.html');
        const content = await readFile(filePath);
        if(!content){
          res.writeHead(404, {'content-type': 'application/json'});
          error = JSON.stringify({error:"page not found"});
          res.write(error);

        }else{
          res.writeHead(200, {
            'content-type': 'text/html'
          });
          res.write(content);
        }
        
        res.end();
      }catch(error){
        res.writeHead(500, {'content-type': 'application/json'});
        res.write(JSON.stringify({error:error}));
        res.end();
      }
    }else if(params.at(1)==="astronomy.html"){
      try{
        const  filePath= path.join(__dirname,'pages','astronomy.html');
        const content = await readFile(filePath);
        if(!content){
          error = JSON.stringify({error:"page not found"});
          res.writeHead(404, {
            'content-type': 'text/html'
          });
    
          res.write(error);

        }else{
          res.writeHead(200, {
            'content-type': 'text/html'
          });
          res.write(content);
        }
        
        res.end();
      }catch(error){
        res.writeHead(500, {'content-type': 'application/json'});
        res.write(JSON.stringify({error:error}));
        res.end();
      }
    }else if(params.at(1)==="home.html"){
      try{
        const  filePath= path.join(__dirname,'pages','home.html');
        const content = await readFile(filePath);
        if(!content){
        
          error = JSON.stringify({error:"page not found"});
          res.writeHead(404, {
            'content-type': 'application/json'
          });
          res.write(error);

        }else{
          res.writeHead(200, {
            'content-type': 'text/html'
          });
          res.write(content);
        }
        
        res.end();
      }catch(error){
        res.writeHead(500, {'content-type': 'application/json'});
        res.write(JSON.stringify({error:error}));
        res.end();
      }
    }else if( params.at(2) === "home.css") {
      try{

        const  filePath= path.join(__dirname,'style','home.css');
        const content = await readFile(filePath);
        
        if(!content){
          error = JSON.stringify({error:"file not found"});
          res.writeHead(404, {
            'content-type': 'application/json'
          });
          res.write(error);
        }else{
          
          res.writeHead(200, {
            'content-type': 'text/css'
          });
          res.write(content);
        }
        res.end();
      }catch(error){
        res.writeHead(500, {'content-type': 'application/json'});
        res.write(JSON.stringify({error:error}));
        res.end();
      }
    }else if(params.at(3)==="astronomy.jpg"){
      try{
        const  filePath= path.join(__dirname,'public','images','astronomy.jpg');
        const content = await readFile(filePath,null);
        if(!content){
       
          error = JSON.stringify({error:"file not found"});
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
      }catch(error){
        res.writeHead(500, {'content-type': 'application/json'});
        res.write(JSON.stringify({error:error}));
        res.end();
      }
    }else if(params.at(3)==="serbal.jpeg"){
      try{
        const  filePath= path.join(__dirname,'public','images','serbal.jpeg');
        const content = await readFile(filePath,null);
        if(!content){
        
          res.writeHead(404, {
            'content-type': 'application/json'
          });
          error = JSON.stringify({error:"file not found"});
          res.write(error);

        }else{
          res.writeHead(200, {
            'content-type': 'image/jpeg'
          });
          res.write(content);
        }
        
        res.end();
      }catch(error){
        res.writeHead(500, {'content-type': 'application/json'});
        res.write(JSON.stringify({error:error}));
        res.end();
      }
    }else{
      try{
        const  filePath= path.join(__dirname,'pages','page-not-found.html');
        const content = await readFile(filePath);
        if(!content){   
          res.writeHead(404, {'content-type': 'application/json'});
          error = JSON.stringify({error:"file not found"});
          res.write(error);

        }else{
          res.writeHead(200, {
            'content-type': 'text/html'
          });
          res.write(content);
        }
        
        
      }catch(error){
        res.writeHead(500, {'content-type': 'application/json'});
        res.write(JSON.stringify({error:error}));
        
      }
      res.end();
    }
  }else if(method === 'POST'){
    if(params.at(1)=== 'inventory'){
      let body = '';
      req.on('data',chunk =>{
        body+= chunk.toString();
      });
      req.on('end',async ()=>{
        try{
          const postData = JSON.parse(body);
        
          const  filePath= path.join(__dirname,'public','data','inventory.json');
          const inventory = await readFile(filePath);
          const parsedInventory = JSON.parse(inventory);
          addItem(parsedInventory,postData,filePath);
          res.writeHead(201,{'content-type': 'text/plain'});
          res.write("Data created successfully");

          res.end();

        }catch(error){
          res.writeHead(400,{'content-type': 'application/json'});
          res.write(JSON.stringify({error:error.message}));
          res.end();
        }
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
 * @param {object[]}inventory the inventory you want to add the item to
 * @param {object}postData - the data you want to add
 * @param {string} path - the path to your inventory
 */
function addItem(inventory,postData ,path) {
  const writeStream = fs.createWriteStream(path);

  const lastItem = inventory.at(-1);
  const newId = (lastItem ? lastItem.id : 0  )+ 1;
  const itemName = postData.itemName ?  postData.itemName : "";
  const quantity = postData.quantity ? parseInt(postData.quantity) : 1;
  const category = postData.category ? postData.category  : "General";
  const item = {
    id: newId,
    itemName: itemName,
    quantity: quantity,
    category: category,
  };
  console.log(`to be added item = ${item}`);
  console.log(`current inventory = ${inventory}`);
  const newinventory = inventory.concat(item);
  writeStream.write(JSON.stringify(newinventory));
  writeStream.end();
  
}
/**
 * @param {string} content - the type of conent you wish for the res to display
 * @param {string[]} params - the url params
 * @param {path} filePath - path for the file
 */