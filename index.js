const http = require('http');
const fs = require('fs');
const inventoryCLI = require('./inventory-cli');

//creating a server 
const server = http.createServer((req, res) => {
  const {method, url } = req;
  const params = url.split("/");
  if (method === 'GET') {
    if (params.at(1) === 'inventory') {
      getAllItems();
    }
  }
});
// listenting to the server
server.listen(3000, () => {
  console.log('Up and running: http://127.0.0.1:3000');
});

/**
 * get all items 
 *  @param {Response} -response from the user
 */
function getAllItems(res){
  const inventory = fs.readFileSync('./inventory.json', 'utf-8');
  res.writeHead(200, {
    'content-type': 'application/json'
  });
  res.write(inventory);
  res.end();
}
