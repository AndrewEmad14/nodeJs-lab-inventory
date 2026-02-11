const http = require('http');
const fs = require('fs');
const path = require('path');
// const inventoryCLI = require('./inventory-cli');

//creating a server 
const server = http.createServer(async(req, res) => {
  const {method, url } = req;
  const params = url.split("/");
  let status = 200;
  let error = "";

  if (method === 'GET') {
    if (params.at(1) === 'inventory') {
      try{
        const id = parseInt(params.at(2));
        let responseData ;
        
        if(id){
          const filePath = path.join(__dirname,'public','data','inventory.json');
          const data = await readFile(filePath);
          const inventory = JSON.parse(data);
          responseData = inventory;
          responseData = inventory.find((item)=>item.id === id);
          if(!responseData){
            status=400;
            error = JSON.stringify({error:"item not found"});
          }else{
            res.writeHead(status, {
              'content-type': 'application/json'
            });
            res.write(JSON.stringify(responseData));
          }
        }else{
          error = JSON.stringify({error:"invalid input"});
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
          status=404;
          error = JSON.stringify({error:"page not found"});
          res.write(error);

        }else{
          res.writeHead(status, {
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
    }else if(params.at(1)==="index.css"){
      try{
        const  filePath= path.join(__dirname,'style','home.css');
        const content = await readFile(filePath);
        if(!content){
          status=404;
          error = JSON.stringify({error:"file not found"});
          res.write(error);

        }else{
          res.writeHead(status, {
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
    }else{
      try{
        const  filePath= path.join(__dirname,'pages','page-not-found.html');
        const content = await readFile(filePath);
        if(!content){
          status=404;
          error = JSON.stringify({error:"file not found"});
          res.write(error);

        }else{
          res.writeHead(status, {
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
    }
  }
});
// listenting to the server
server.listen(3000, () => {
  console.log('Up and running: http://127.0.0.1:3000');
});

/**
 * @param - takes the path and use it to get the data from the file
 * @returns - promise of the data
 */
function readFile(path){
  return new Promise((resolve,reject)=>{
    const stream = fs.createReadStream(path);

    let data = '';
    stream.on('data',(chunk)=>{
      data+=chunk;
    });
    stream.on('end',()=>{
      resolve(data);
    });
    stream.on('error',reject);
  });
  
}