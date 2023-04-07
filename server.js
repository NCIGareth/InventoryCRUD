//Setup

const https = require("https");

const fs = require("fs");

const express = require("express");

const app = express();

const path = require("path");

const sqlite3 = require("sqlite3").verbose();




//Views

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));




//Database Setup

const db_name = path.join(__dirname, "data", "inventory.db");

const db = new sqlite3.Database(db_name, err => {

  if (err) {

    return console.error(err.message);

  }

  console.log("Successful connection to the database 'inventory.db'");

});




const sql_create = `CREATE TABLE IF NOT EXISTS Inventory (

ITEM_ID INTEGER PRIMARY KEY AUTOINCREMENT,

Title VARCHAR(100) NOT NULL,

Brand VARCHAR(100) NOT NULL,

Description TEXT

);`;



// Database seeding

const sql_insert = `INSERT INTO Inventory (ITEM_ID, Title, Brand, Description) VALUES

(1, 'ToolBox', 'Dewalt', 'Toolbox to store your tools'),

(2, 'Hammer', 'Milwake', 'Claw Hammer'),

(3, 'Socketset', 'InventoryBasics', 'Large SocketSet');`;

db.run(sql_insert, err => {

  if (err) {

    return console.error(err.message);

  }

  console.log("Successful creation of 3 Items");

});

db.run(sql_create, err => {

  if (err) {

    return console.error(err.message);

  }

  console.log("Successful creation of the 'Inventory' table");

});




app.get("/inventory", (req, res) => {

  const sql = "SELECT * FROM Inventory ORDER BY Title"

  db.all(sql, [], (err, rows) => {

    if (err) {

      return console.error(err.message);

    }

    res.render("inventory", { model: rows });

  });

});




// Test

app.get("/test", (req, res) => {

  res.status(200).json({ success: true });




});





const port = 8443;

https

  .createServer(

    // Provide the private and public key to the server by reading each

    // file's content with the readFileSync() method.

    {

      key: fs.readFileSync("./key.pem"),

      cert: fs.readFileSync("./cert.pem"),

    },

    app

  )

  .listen(port, () => console.log(`Application Running on Port ${port}`));




app.get("/", (req, res) => {

  res.redirect("/inventory");

});




// Edit Item

app.get("/edit/:id", (req, res) => {

  const id = req.params.id;

  const sql = "SELECT * FROM Inventory WHERE ITEM_ID = ?";

  db.get(sql, id, (err, row) => {

    // if (err) ...

    res.render("edit", { model: row });

  });

});




app.post("/edit/:id", (req, res) => {

  const id = req.params.id;

  const inventory = [req.body.Title, req.body.Brand, req.body.Description, id];

  const sql = "UPDATE Inventory SET Title = ?, Brand = ?, Description = ? WHERE (ITEM_ID = ?)";

  db.run(sql, inventory, err => {

    // if (err) ...

    res.redirect("/inventory");

  });

});




// Create Item

app.get("/create", (req, res) => {

  res.render("create", { model: {} });

});




app.post("/create", (req, res) => {

  const sql = "INSERT INTO Inventory (Title, Brand, Description) VALUES (?, ?, ?)";

  const inventory = [req.body.Title, req.body.Brand, req.body.Description];

  db.run(sql, inventory, err => {

    // if (err) ...

    res.redirect("/inventory");

  });

});




// GET /delete/5

app.get("/delete/:id", (req, res) => {

  const id = req.params.id;

  const sql = "SELECT * FROM Inventory WHERE ITEM_ID = ?";

  db.get(sql, id, (err, row) => {

    // if (err) ...

    res.render("delete", { model: row });

  });

});




// POST /delete/5

app.post("/delete/:id", (req, res) => {

  const id = req.params.id;

  const sql = "DELETE FROM Inventory WHERE ITEM_ID = ?";

  db.run(sql, id, err => {

    // if (err) ...

    res.redirect("/inventory");

  });

});