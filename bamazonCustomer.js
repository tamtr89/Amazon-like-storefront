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
            colWidths: [15, 35, 35, 20, 20],
        });
        var item_IDs = [];
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
            );
        }
        console.log(chalk.yellow.bold("DISPLAY TABLE"));
        console.log(table.toString());
        
        askItemID(item_IDs);
    })
}
showItemsTable();


// The app should then prompt users with two messages.
// 1.The first should ask them the ID of the product they would like to buy.
// 2.The second message should ask how many units of the product they would like to buy.
function askItemID() {
    inquirer.prompt([
        {
            name: "buy",
            type: "input",
            message: "What's the item_ID (look in the table) of the product would you like to buy? [Press Ctrl+C to Quit]",
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units of ther product would you like to buy?"
        }])
        .then(function (answer) {
            // set a query to select the item the user has chosen
            var query = "SELECT item_id, stock_quantity, price FROM products WHERE ?";
            connection.query(query, { item_id: answer.buy }, function (err, res) {
                console.log(chalk.yellow("USER ANSWER"), res);
                var inputQuantity = answer.quantity;
                var choosenItem = res[0];  
                checkStock(res[0].stock_quantity, inputQuantity, res[0].price.toFixed(2), res[0].item_ID, choosenItem);  
            });
        })
}
// check if your store has enough of the product to meet the customer's request.
function checkStock(on_stock, buy_quantity, price, item_id, choosenItem) {
    if (on_stock >= buy_quantity) {
        console.log(chalk.blue("Quantity: ", buy_quantity));
        console.log(chalk.blue("Price: " + "$" + price));
        var totalPrice = buy_quantity * price;
    
        console.log(chalk.magenta.bold("Your total amount is: " + "$$" + totalPrice + "\n" + "Thank you for your purchase on BAMAZON!" + "\n"));
        updateStock(buy_quantity, item_id, choosenItem);
        // If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
    } else {
        console.log(chalk.red("Insufficient quantity! Sorry!" + "\n" + "ONLY " + on_stock + " items on stock!"));
        connection.end();
    }
}

//  updating the SQL database to reflect the remaining quantity.
function updateStock(quantity, item_id, choosenItem) {
    var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
    
    connection.query(query, [quantity, choosenItem.item_id ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            
            console.log("ERROR", err);
            // showItemsTable();
            connection.end();
        });
}


