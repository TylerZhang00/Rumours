// const properties = require("./json/properties.json");
// const users = require("./json/users.json");
const { Pool } = require("pg");
require("dotenv").config();

//****connect database using node-postgress****//
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL,
  port: process.env.DB_PORT
});

/**
 * Get all dishes to dashboard.
 * @param {string}  .
 * @return {Promise<[{}]>} A promise to the required function.
 */
const getMenu = function() {
  return pool
    .query(
      `
      SELECT * FROM dishes
  `,
      []
    )
    .then(res => res.rows);
  // return getmenu
};
exports.getMenu = getMenu;

/**
 * Add a new customer to the database.
 * @param {{name: string, password: string, email: string, phone: string}} customer
 * @return {Promise<{}>} A promise to the customer.
 */
const registerCustomer = function(customer) {
  return pool
    .query(
      `
  INSERT INTO users(name,email,password,phone)
  values($1,$2,$3,$4) RETURNING *
  `,
      [customer.name, customer.email, customer.password, customer.phone]
    )
    .then(res => console.log(res.rows));
};
exports.registerCustomer = registerCustomer;

/**
 * Get a single customer from the database given their email.
 * @param {String} email The email of the customer.
 * @return {Promise<{}>} A promise to the customer.
 */

const getCustomerWithEmail = function(email) {
  return pool
    .query(
      `
  SELECT * FROM customers
  WHERE email = $1
  `,
      [email.toLowerCase()]
    )
    .then(res => res.rows[0]);
};
exports.getCustomerWithEmail = getCustomerWithEmail;

/**
 * Get a single customer from the database given their id.
 * @param {string} id The id of the customer.
 * @return {Promise<{}>} A promise to the id.
 */
const getCustomerWithId = function(id) {
  return pool
    .query(
      `
  SELECT * FROM customers
  WHERE id = $1
  `,
      [id]
    )
    .then(res => res.rows[0]);
};
exports.getCustomerWithId = getCustomerWithId;

/**
 * Add a new order to the database.
 * @param {{customer_id: INTEGER}} order
 * @return {Promise<{}>} A promise to the order.
 */
const generateOrder = function(order) {
  return pool
    .query(
      `
      INSERT INTO orders (customer_id) VALUES ($1) RETURNING id
      `,
      [order.customerId]
    )
    .then(res => {
      return res.rows[0].id;
    });
};
exports.generateOrder = generateOrder;

/**
 * Add a new item to ordered-items database.
 * @param {{order_id: INTEGER,dish_id: INTEGER,quantity: price}} item
 * @return {Promise<{}>} A promise to the order.
 */
const generateOrderSummary = function(orderId, item) {
  const inserts = Object.keys(item).map(dishId => {
    const quantity = item[dishId][1];
    return pool.query(
      `
    INSERT INTO ordered_items (order_id,dish_id,quantity) VALUES ($1,$2,$3) RETURNING *
`,
      [orderId, dishId, quantity]
    );
  });

  return Promise.all(inserts).then(results => {
    //....
  });
};
exports.generateOrderSummary = generateOrderSummary;

///to send orderSummary to restaurant
/**
 * Get all order items for a single order.
 * @param {string} order_id The id of the order.
 * @return {Promise<[{}]>} A promise to the order_id
 */
const getOrderSummary = function(orderId) {
  let number = Number(Object.values(orderId));
  return pool
    .query(
      `
      SELECT order_id,dishes.name AS item,quantity,price,price*quantity AS sum
      FROM ordered_items
      JOIN dishes ON dishes.id = dish_id
      WHERE order_id = $1
      GROUP BY order_id,dishes.name,quantity,price;

  `,
      [number]
    )
    .then(res => res.rows);
  // return getOrderSummary
};
///orderSummary send to the restaurant
exports.getOrderSummary = getOrderSummary;

///to send total price to restaurant
/**
 * Get all order items for a single order.
 * @param {string} order_id The id of the order.
 * @return {Promise<[{}]>} A promise to the order_id
 */
const getOrderTotal = function(orderId) {
  let number = Number(Object.values(orderId));
  return pool
    .query(
      `
      SELECT SUM(total) FROM (
        SELECT order_id,dishes.name AS item,quantity,price,price*quantity as total
        FROM ordered_items
        JOIN dishes ON dishes.id = dish_id
        WHERE order_id = $1
        GROUP BY order_id,dishes.name,quantity,price
        ) AS tot;
  `,
      [number]
    )
    .then(res => res.rows);
  // return getOrderSummary
};

exports.getOrderTotal = getOrderTotal;
///orderSummary send to the restaurant

// /**
//  * Add a dish to the database
//  * @param {{}} dish An object containing all of the dish details.
//  * @return {Promise<{}>} A promise to the dish.
//  */
// const addDish = function(dish) {
//   console.log(dish);
//   return pool
//     .query(
//       `
//       INSERT INTO dishes (name,thumbnail_photo_url,price) VALUES ('Chicken Burger','pic1',8);
//       VALUES ($1,$2,$3) RETURNING *
//       `,
//       [
//         dish.name,
//         dish.thumbnail_photo_url,
//         dish.price
//       ]
//     )
//     .then(res => res.rows);
// };
// exports.addDish = addDish;
