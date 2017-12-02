const Sequelize = require("sequelize");

function database(database) {
  const sequelize = new Sequelize(database+"://dao:password@localhost/inventory");
  let Inventory = sequelize.define('inventory', {
    articulo: Sequelize.STRING,
    cantidad: Sequelize.INTEGER,
    precio: Sequelize.INTEGER,
    data: Sequelize.BLOB('long'),
    mimetype: Sequelize.STRING
  });
  Inventory.sync();
  return Inventory;
}

module.exports = database;
