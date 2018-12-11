var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var chalk = require("chalk");


var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "tam89",
    database: "bamazon_DB"
})

// Connection with server
connection.connect(function (err) {
    if (err) throw err;
    console.log(chalk.yellow.bgMagenta("\nConnection as id: " + connection.threadId));
    menuOption();
});

function menuOption() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: chalk.cyan.bgMagenta.bold("Please select a menu option? (Press Ctrl+C to exit) \n"),
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            // console.log(chalk.red("ANSWER:" ,answer.action));
            switch (answer.action) {
                case "View Products for Sale":
                    viewItemsForSale();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addNewItems();
                    break;
            }
        });
}

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function viewItemsForSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["Item ID", "Product Name", "Deparment Name", "Price", "Quantity Available"],
            // Setting the width of each colums
            colWidths: [20, 35, 35, 25, 20],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        menuOption();
    });
}

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ["Item ID", "Product Name", "Deparment Name", "Price", "Quantity Available"],
            // Setting the width of each colums
            colWidths: [20, 35, 35, 25, 20],
        });
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
                );
            }
        }
        if (table.length > 0) {
            console.log(chalk.red.bgYellow.bold("HERE ARE LOW QUANTITY PRODUCTS (less than 5): \n"));
            console.log(table.toString());
        } else {
            console.log(chalk.green("\nThere are no low quantity stock right now!\n"));
        }
        menuOption();
    })
}

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ["Item ID", "Product Name", "Deparment Name", "Price", "Quantity Available"],
            // Setting the width of each colums
            colWidths: [20, 35, 35, 25, 20],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());

        inquirer.prompt([
            {
                name: "item_number",
                type: "number",
                message: "Which product would you like to add to? (item_id)"
            },
            {
                name: "how_many",
                type: "number",
                message: "How many more would you like to add?"
            },
        ]).then(function (user) {
            var newQuantityAdd = parseInt(res[user.item_number - 1].stock_quantity) + parseInt(user.how_many);
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuantityAdd
                    },
                    {
                        item_id: user.item_number
                    }
                ], function (error, results) {
                    if (err) throw err;

                    console.log(chalk.black.bgYellow("\nYOUR QUANTITY HAS BEEN UPDATED!\n" + user));
                    menuOption();
                });
        });
    });
}

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function addNewItems() {
    // console.log("ADDING NEW...");
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What is the product name?"
        },
        {
            name: "departmentName",
            type: "input",
            message: "What the department is it in?"
        },
        {
            name: "itemPrice",
            type: "number",
            message: "How much is it cost?"
        },
        {
            name: "itemQuantity",
            type: "number",
            message: "How many do we have of this product?"
        },
    ]).then(function (user) {
        connection.query("INSERT INTO products SET ?",
            {
                // when finished prompting, insert a new item into the db with that info
                product_name: user.productName,
                department_name: user.departmentName,
                price: user.itemPrice,
                stock_quantity: user.itemQuantity

            }, function (err, res) {
                if (err) throw err;
            
                console.log(chalk.green.bgBlack.bold("\n YOUR PRODUCT HAS BEEN ADDED! \n"));
                menuOption();
            });
    });
}