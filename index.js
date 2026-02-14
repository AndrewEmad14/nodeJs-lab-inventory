//imports
const express = require('express');
const app = express();
const path = require('path');
const enums = require('./enums');
const helpers = require('./helpers');

// middleware validations

/**
 *  validates id if it is a number or if it is negative
 * @param {Request} req   request
 * @param {Response} res response
 * @param {*} next   next middleware
 */
function validateId (req, res, next) {
  const id = Number(req.params.productId);

  if (isNaN(id) || id < 0) {
    return res.status(400).send("Invalid input");
  } 

  next(); 

}
/**
 *  validates quantity if it is a number or if it is negative
 * @param {Request} req   request
 * @param {Response} res response
 * @param {*} next   next middleware
 */
function validateQuantity(req, res, next) {
  const quantity = Number(req.params.quantity);

  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).send("Invalid input");
  }  
  next(); 
}
/**
 *  validates productbody 
 * @param {Request} req   request
 * @param {Response} res response
 * @param {*} next   next middleware
 */
function validateProductBody(req,res,next){
  const productBody = req.body;
  if(!(productBody.itemName.match(/^[a-zA-Z]{2,50}$/))){
    return res.status(400).send("Invalid item name");
  }
  const quantity = Number(productBody.quantity);
  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).send("Invalid quantity");
  } 
  if(!(productBody.category.match(/^[a-zA-Z]{2,50}$/))){
    return res.status(400).send("Invalid category");
  }
  next();
}
/**
 *  goes to page not found
 * @param {Request} req   request
 * @param {Response} res response
 */
async function routeToPageNotFound(req,res){
  try{
    const filePath = path.join(__dirname,enums.folders.PAGES,`${enums.routes.PAGE_NOT_FOUND_HTML}`);
    const content = await helpers.getPage(filePath); 
    if(content){
      return res.status(404).send(content);
    }else{
      return res.status(500).send("server error");
    }
  }catch(error){
    return res.status(500).send(error);
  }
}


function errorHandler(err,req,res,next){
  console.log(err);
  res.status(500).send("something failed!");

}
// ask for  traversal attacks

//uses the public folder statically
app.use(express.static(enums.folders.PUBLIC));

// for parsing application/json requests
app.use(express.json());          


app.set('view engine', 'pug');
app.set('views',path.join(__dirname,enums.folders.PAGES));


app.get(`/${enums.routes.PRODUCT}/:productId`, validateId, async (req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PUBLIC,enums.folders.DATA,`${enums.routes.PRODUCT}.json`);
    const id = parseInt(req.params.productId);
    const product = await helpers.getproductById(filePath,id);
    if(product){
      return res.status(200).send(product);
    }
    next();
  }catch(error){
    next(error);
  }

},routeToPageNotFound,errorHandler);

app.get(`/${enums.routes.PRODUCT}`,async (req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PUBLIC,enums.folders.DATA,`${enums.routes.PRODUCT}.json`);
    const productList = await helpers.getproduct(filePath);
    if(productList){
      return res.status(200).render('index', { title: 'avilable items',  productList });
    }
    next();
  }catch(error){
    next(error);
  }
},routeToPageNotFound,errorHandler);

app.get(`/${enums.routes.HOME_HTML}`,async(req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PAGES,`${enums.routes.HOME_HTML}`);
    const content = await helpers.getPage(filePath);
    if(content){
      return res.status(200).send(content);
    }
    next();
  }catch(error){
    next(error);
  }
},routeToPageNotFound,errorHandler);

app.get(`/${enums.routes.ASTRONOMY_HTML}`,async (req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PAGES,`${enums.routes.ASTRONOMY_HTML}`);
    const content = await helpers.getPage(filePath);
    if(content){
      return res.status(200).send(content);
    }
    next();
  }catch(error){
    next(error);
  }
},routeToPageNotFound,errorHandler);
app.get(`/${enums.routes.SERBAL_HTML}`,async(req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PAGES,`${enums.routes.SERBAL_HTML}`);
    const content = await helpers.getPage(filePath);
    if(content){
      return res.status(200).send(content);
    }
    next();
  }catch(error){
    next(error);
  }
},routeToPageNotFound,errorHandler);

app.post(`/${enums.routes.PRODUCT}`,validateProductBody,async (req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PUBLIC,enums.folders.DATA,`${enums.routes.PRODUCT}.json`);
    const status = await helpers.addItem(filePath,req.body);
    res.status(status).send("item added!");
  }catch(error){
    next(error);
  }
  
},errorHandler);

app.delete(`/${enums.routes.PRODUCT}/:productId`,validateId,async(req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PUBLIC,enums.folders.DATA,`${enums.routes.PRODUCT}.json`);
    const id = parseInt(req.params.productId);
    const status = await helpers.removeItem(filePath,id);
    res.status(status).send("item removed");
  }catch(error){
    next(error);
  }
},errorHandler);

app.patch(`/${enums.routes.PRODUCT}/:productId`,validateId,validateProductBody,async (req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PUBLIC,enums.folders.DATA,`${enums.routes.PRODUCT}.json`);
    const id = parseInt(req.params.productId);
    const status = await helpers.patchItem(filePath,req.body,parseInt(id));
    res.status(status).send("item patched");
  }catch(error){
    next(error);
  }
},errorHandler);
app.patch(`/${enums.routes.PRODUCT}/:productId/destock/:quantity`,validateId,validateQuantity,async (req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PUBLIC,enums.folders.DATA,`${enums.routes.PRODUCT}.json`);
    const id = parseInt(req.params.productId);
    const quantity = parseInt(req.params.quantity);
    const status = await helpers.destockItem(filePath,quantity,id);
    res.status(status).send("item destock");
  }catch(error){
    next(error);
  }
},errorHandler);
app.patch(`/${enums.routes.PRODUCT}/:productId/restock/:quantity`,validateId,validateQuantity,async(req,res,next)=>{
  try{
    const filePath = path.join(__dirname,enums.folders.PUBLIC,enums.folders.DATA,`${enums.routes.PRODUCT}.json`);
    const id = parseInt(req.params.productId);
    const quantity = parseInt(req.params.quantity);
    const status = await helpers.restockItem(filePath,quantity,id);
    res.status(status).send("item restock");
  }catch(error){
    next(error);
  }
},errorHandler);
app.use(routeToPageNotFound);






app.listen(enums.PORT,()=>{
  console.log(`Example app listening on port ${enums.PORT}`);
});









