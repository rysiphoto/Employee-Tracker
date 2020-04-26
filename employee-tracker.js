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
                case "View All Employees By Department":
                    viewAllDepartment();
                    break;
                case "View All Employees By Manager":
                    viewAllEManagement();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployee();
                    break;
                case "Update Employee Manager":
                    updateEManager();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees() {

    connection.query("SELECT id,first_name,last_name FROM employee", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + ". " + res[i].first_name + " " + res[i].last_name);
        }
        runMenu();
    });
}

function viewAllDepartment() {
    inquirer.prompt({
        name: "viewAllDept",
        type: "list",
        choices: [
            "JavaScript Programmer",
            "SQL Programmer",
            "Front End Programmer",
            "Scrum Master",
            "Manager"
        ]
    })
        .then(function (answer) {
            var query = "SELECT employee.role_id WHERE role.department_id are EQUAL";
            connection.query(query, [answer.start, answer.end], function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log(res[i].first_name + " " + res[i].last_name);
                }

            });
            runMenu();
        })


}

// var query = "SELECT employee.role_id WHERE role.department_id are EQUAL";
// if (answer.viewAllDept === "JavaScript Programmer") {
//     connection.query(query, [answer.first_name + " " + answer.last_name], function (err, res) {
//         console.log(res.length);


function viewAllEManagement() {
    inquirer
        .prompt({
            name: "allEManagement",
            type: "list",
            message: "Select a manager to view their employees."
        });
};

function addEmployee() {
    inquirer
        .prompt({
            name: "addEmployee",
            type: "list",
            message: "Select what you would like to do.",
            choices: ["Add Employee", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.addEmployee === "Add Employee") {
                postEmployee();
            } else {
                runMenu();
                // connection.end();
            }
        });
};

function postEmployee() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "First Name:"
        },
        {
            name: "last_name",
            type: "input",
            message: "Last Name:"
        },
        {
            name: "role_id",
            type: "input",
            message: "Role ID:",

            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "manager_id",
            type: "input",
            message: "Manager ID:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id || 1,
                    manager_id: answer.manager_id || 1
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your employee was created successfully!");

                    runMenu();
                }
            );
        });

}

function removeEmployee() {
    inquirer
        .prompt({
            name: "",
            type: "",
            message: ""
        });
};

function updateEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "empName",
                    type: "rawlist",
                    choices: function () {
                        var choicesArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choicesArray.push(results[i].first_name + " " + results[i].last_name);
                        }
                        return choicesArray;
                    },
                    message: "Who's role would you like to update?"
                },
                {
                    name: "empRUpdate",
                    type: "input",
                    message: "What is their new role code?"
                }

            ]);
    }
    )
}


function updateEManager() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "empMName",
                    type: "rawlist",
                    choices: function () {
                        var choicesArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choicesArray.push(results[i].first_name + " " + results[i].last_name);
                        }
                        return choicesArray;
                    },
                    message: "Who's manager would you like to update?"
                },
                {
                    name: "empMUpdate",
                    type: "input",
                    message: "Who is their new manager?"
                }

            ]);
    }
    )
}
