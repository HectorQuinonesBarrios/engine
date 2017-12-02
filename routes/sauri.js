const express = require('express');
const router = express.Router();
const Inventory = require('./../sql/db')('mysql');
const multer = require('multer');
const upload = multer({dest:'./tmp'});
const type = upload.single('file');
const fs = require('fs');
const async = require('async');

router.get('/',function(req, res, next){
  Inventory.findAll().then((objects, err)=>{
    let tempArray = [];
    objects.forEach(object=>{
      let data = {img:{}};
      console.log(object.dataValues);
      data._id = object.dataValues.id;
      data.articulo = object.dataValues.articulo;
      data.cantidad = object.dataValues.cantidad;
      data.precio = object.dataValues.precio;
      data.img.data = object.dataValues.data.toString('base64');
      data.img.mimetype = object.dataValues.mimetype;
      tempArray.push(data)
    });
    return res.status(200).json(tempArray);
  });

});
router.post('/', type,function(req,res,next) {
  let inventory = {
    articulo:req.body.articulo,
    cantidad:req.body.cantidad,
    precio:req.body.precio,
  };
  if(req.file){
    inventory.data = fs.readFileSync(req.file.path);
    inventory.mimetype = req.file.mimetype;

  } else {
    return res.sendStatus(400);
  }
  Inventory.create(inventory).then((object, raw)=>{
    let data = {img:{}};
    console.log(object.dataValues);
    data._id = object.dataValues.id;
    data.articulo = object.dataValues.articulo;
    data.cantidad = object.dataValues.cantidad;
    data.precio = object.dataValues.precio;
    data.img.data = object.dataValues.data.toString('base64');
    data.img.mimetype = object.dataValues.mimetype;
    return res.status(200).json({object:data,base64:data.img.data.toString('base64')});
  });
});
router.delete('/:id',function(req,res,next) {
  Inventory.destroy({
    where: {
      id: req.params.id
    }
  });
  return res.sendStatus(200);
});
module.exports = router;
