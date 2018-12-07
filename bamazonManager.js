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
    console.log(chalk.cyan("Connection as id: " + connection.threadId));
    menuOption();   
});


// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product



function menuOption() {
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "Please select a menu option?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    })
    .then(function (answer) {
        // console.log(chalk.red("ANSWER:" ,answer));
        switch (answer.action) {
            case "View Products for Sale":
            viewItemsForSale();
            break;
            
            case "View Low Inventory":
            viewLowInventory();
            break;
            
            case "Add to Inventory":
            viewItemsForSale(addToInventory);
            break;
            
            case "Add new Product":
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
            colWidths: [15, 35, 35, 20, 20],
        });

        for(var i = 0; i< res.length; i++){
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        menuOption();
    });
}

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLowInventory(){
    connection.query("SELECT * FROM products", function(err,res){
        if(err) throw err;
        var table = new Table({
            head: ["Item ID", "Product Name", "Deparment Name", "Price", "Quantity Available"],
            // Setting the width of each colums
            colWidths: [15, 35, 35, 20, 20],
        });
        for(var i = 0; i < res.length; i++){
            if(res[i].stock_quantity < 5){
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
                );
            }
        }
        if(table.length > 0){
            console.log(chalk.red.bgYellow.bold("Here are low quantity products (less than 5): "));
            console.log(table.toString());   
        }else{
            console.log("\nThere are no low quantity stock right now!\n");
        }
        menuOption();
    })
}

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.