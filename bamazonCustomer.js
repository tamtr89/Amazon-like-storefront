var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
const chalk = require("chalk");
// -------------------------------------------------

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "tam89",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(chalk.magenta("connected as id " + connection.threadId + "\n"));

});

// Table of current items available using cli-table npm

function showItemsTable() {
    var queryItems = "SELECT * FROM products";
    connection.query(queryItems, function (err, res) {
        console.log(chalk.cyan("Welcome to Bamazon!"));

        if (err) throw err;

        var table = new Table({
            // column names
            head: ["Item ID", "Product Name", "Deparment Name", "Price", "Quantity Available"],
            // Setting the width of each colums
            colWidths: [10, 30, 20, 20, 20]
        });
        var item_IDs = [];
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
            );
        }
        console.log(chalk.yellow.bold("DISPLAY TABLE") + "\n", table.toString());
        askItemID(item_IDs);
    })
}
showItemsTable();


// The app should then prompt users with two messages.
// 1.The first should ask them the ID of the product they would like to buy.
// 2.The second message should ask how many units of the product they would like to buy.
