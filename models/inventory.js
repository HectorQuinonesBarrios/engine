const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
let inventorySchema = new Schema({
  articulo:{type: String, required:true},
  cantidad:{type: Number, required:true},
  precio:{type: Number, required:true},
  img:{
    data:{type: Buffer, require:true},
    mimetype:{type:String, require:true}
  }
});
class InventoryClass{

    constructor(){};

    get getImgString64(){
        return this.img.data.toString('base64');
    }


}
inventorySchema.loadClass(InventoryClass);
let Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
