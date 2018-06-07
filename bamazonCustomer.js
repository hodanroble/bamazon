//requre mysql to make use of it for the application.
var request = require("request");
var mySQL = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

//stashing the connection informatin in variables for easy & fast adjustment later.
var dbHost = "localhost";
var dbPort = 3306;
var dbUser = "root";
var dbPassword = "Ruwayda100!";
var dbDatabase = "bamazondb";

//connect to the DB and press the information up to then database.
var connection = mySQL.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
});

//throw an error if the DBA doesn't exist.
connection.connect(function(error) {
    if (error) throw error;
    // console.log("connected as ID " + connection.threadId);
    initialConnection();
});

//display the list from the DBA for the user
function initialConnection() {
    console.log("\n ~_~ WELCOME to Bamazon! ~_~ \n");
    connection.query("SELECT * FROM products", function(error, result) {
        if (error) throw error;

        for (var i = 0; i < result.length; i++) {
            console.log(result[i].item_id + " | " + result[i].product_name +
                " | $" + result[i].price);
        }
        console.log("\n");
        openingQuestions();
    });
};

function openingQuestions() {
    //prompt the user - Which ID they wish to buy from the list displayed
    inquirer
        .prompt([{
                //ask the user which of the items they would like to purchase.
                name: "item_id",
                type: "input",
                message: "\nPlease enter the id # of the item you would like to purchase.",
                choices: ["id"],
                //validate the ID entered is a valid choice.
                validate: function(value) {
                    return isNumValue(value);
                }
            },
            //ask the user how many of that item they would like to buy
            {
                name: "itemCount",
                type: "input",
                message: "\nHow many of this item would you like to purchase?",
                validate: function(value) { return isNumValue(value); }
            }
        ])
        .then(function(answer) {
            //check to see if there is enough of the selected item.
            isIDValid(answer);
        })
}

//control/validation functions
function isNumValue(value) {
    if (isNaN(value) === false) {
        return true;
    }
    return "not valid, enter a number.";
    return false;
};

function isIDValid(answer) {
    //check to see if the id entered is one on the list.
    var sql = "SELECT COUNT(*) ?? FROM ?? WHERE ?? = ?";
    var inserts = ["cnt", "bamazondb.products", "item_id", answer.item_id];
    sql = mySQL.format(sql, inserts);
    connection.query(sql, function(error, result) {
        if (error) throw error; //if the item is not good throw an error
        //display how many matches they found that match the ID selected
        console.log("\nWe found " + result[0].cnt + " item(s) with that matching ID.\n");
        if (result[0].cnt === 0) {
            console.log("that ID does not exist, please try again");
            openingQuestions(); //restart questions once verified to be a bad ID.
            return;
        }
        isItemsInStock(answer);
    });
}

function isItemsInStock(answer) {
    //check to see if the item is in stock.
    var sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    var inserts = ["stock_quantity", "products", "item_id", answer.item_id];
    sql = mySQL.format(sql, inserts);
    connection.query(sql, function(error, result) {
        if (error) throw error;
        if (answer.itemCount <= result[0].stock_quantity) { //if the items is in stock start a purchase check

            console.log("You entered " + answer.itemCount);
            console.log("We have  " + result[0].stock_quantity + " of that item");

            console.log("\nWe have that item in stock!");
            console.log("The item has been pulled from the shelves...and we are packaging it now.\n");

            var usersSelection = result[0].stock_quantity - answer.itemCount; //press the equation to be worked into a variable for ease of use.
            var query = connection.query(
                "UPDATE products SET ? WHERE ?", [{
                        stock_quantity: usersSelection
                    },
                    {
                        item_id: answer.item_id
                    }
                ],
                function(error, result) {
                    if (error) throw error;

                    console.log("product updated! " + usersSelection + " left.");

                    checkAdditonalOrders();
                }
            );
        } else {
            console.log("Sorry, we don't have enough of that product, please try again");
            openingQuestions(answer);
        }
    });
}

function checkAdditonalOrders() {
    inquirer.prompt([{
        type: "confirm",
        name: "aroundAgain",
        message: "Would you like to place another order?",
        default: true
    }]).then(function(answers) {
        if (answers.aroundAgain) {
            initialConnection();
        } else {
            console.log("\nThank you for shopping\n");
            console.log("\n ~_~ WELCOME to Bamazon! ~_~ \n");
            connection.end();
        }
    });
}

