const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
    database: "employee_trackerDB"

});

connection.connect(function (err) {
    if (err) throw err;
    runMenu();
});

function runMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                // case "View All Employees By Department":
                //     viewAllDepartment();
                //     break;
                // case "View All Employees By Manager":
                //     viewAllEManagement();
                //     break;
                // case "Add Employee":
                //     addEmployee();
                //     break;
                // case "Remove Employee":
                //     removeEmployee();
                //     break;
                // case "Update Employee Role":
                //     updateEmployee();
                //     break;
                // case "Update Employee Manager":
                //     updateEManager();
                //     break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}
function viewAllEmployees() {
    inquirer
        .prompt({
            name: "employees",
            type: "input",
            message: "View All Employees"
        })
        .then(function (answer) {
            var query = "Select an Employee";
            connection.query(query, { Employees: answer.id }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log(res[i].id + ". " + res[i].first_name + " " + res[i].last_name);
                }
                runMenu();
            });
        });
}