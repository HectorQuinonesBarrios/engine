const express = require('express');
const router = express.Router();
const Inventory = require('./../models/inventory');
const multer = require('multer');
const upload = multer({dest:'./tmp'});
const type = upload.single('file');
const fs = require('fs');
const async = require('async');
//Get
router.get('/', function(req, res, next) {
  console.log("GETTO DASE");
  Inventory.find().lean().exec((err,objects)=>{

    let tempArray = [];
    let imgArray = [];
    objects.forEach(object=>{
      object.img.data = object.img.data.toString('base64');
      tempArray.push(object);
    });


    return res.status(200).json(tempArray);
  });
});
router.post('/',type, function(req, res, next) {

  let inventory = new Inventory({});
  if(req.file){
    inventory.img.data = fs.readFileSync(req.file.path);
    inventory.img.mimetype = req.file.mimetype;

  } else {
    return res.sendStatus(400);
  }
  inventory.articulo = req.body.articulo;
  inventory.cantidad = req.body.cantidad;
  inventory.precio = req.body.precio;

  console.log("POSTU");

  inventory.save((err,object)=>{
    if (err) {
      return res.sendStatus(400);
    } else {

      return res.status(200).json({object:object, base64:object.img.data.toString('base64')});
    }
  });
});
router.put('/:id', type ,function(req, res, next) {
  console.log("PUT");
  console.log(req.body);
  let inventory = {
    articulo:req.body.articulo,
    cantidad:req.body.cantidad,
    precio:req.body.precio
  };
  Inventory.update({_id:req.params.id},{$set:inventory},(err)=>{
    if (err) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(200);
    }
  });
});
router.delete('/:id', function(req, res, next) {
  Inventory.remove({_id:req.params.id},(err)=>{
    if (err) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(200);
    }
  });
});

module.exports = router;
