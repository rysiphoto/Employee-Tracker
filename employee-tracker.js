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
            message: `
            _______  __   __  _____ __    ______  __   __ _______  _______
            |   ___| | ⧹ / |  |  O || |   |  _  | ⧹ ⧹ / / |   ___| |   ___|
            |  |___  | |V| |  |  __|| |   | | | |  ⧹ V /  |  |___  |  |___
            |  ____| | | | |  |  |  | |   | | | |   | |   |  ____| |  ____|
            |  |___  | | | |  |  |  | |__ | |_| |   | |   |  |___  |  |___
            |______| |_| |_|  |__|  |____||_____|   |_|   |______| |______|
            DATABASE
            `,
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Add Department",
                "Add Employee Role",
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
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Employee Role":
                    addRole();
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


    function viewAllEmployees() {
        connection.query("SELECT id,first_name,last_name, role_id, manager_id FROM employee", function (err, res) {
            if (err) throw err;
            console.log("ID --- NAME ------ ROLE -Manager")
            for (var i = 0; i < res.length; i++) {

                console.log(res[i].id + ". " + res[i].first_name + " " + res[i].last_name + " || " + res[i].role_id + " || " + res[i].manager_id);
            }
            runMenu();
        });

    }

    function viewAllDepartment() {
        connection.query("SELECT department.name, department.id FROM department", function (err, results) {
            if (err) throw err;

            inquirer.prompt({
                name: "viewAllDept",
                type: "list",
                choices: function () {
                    var choicesDptArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choicesDptArray.push(results[i].name);

                    }
                    return choicesDptArray;

                }
            })
                .then(function (answer) {
                    var query = "SELECT role_id, first_name, last_name FROM employee INNER JOIN department WHERE department.id = role_id";
                    connection.query(query, [answer.start, answer.end], function (err, res) {

                        for (var i = 0; i < res.length; i++) {
                            console.log("");
                            console.log(res[i].role_id + ". " + res[i].first_name + " " + res[i].last_name);
                        }

                    });
                    runMenu();
                })


        })
    }

    function viewAllEManagement() {
        connection.query("SELECT employee.name FROM employee WHERE employee.manager_id", function (err, results) {
            if (err) throw err;
            inquirer
                .prompt({
                    name: "allEManagement",
                    type: "list",
                    message: "Select a manager to view their employees.",
                    choices: function () {
                        var empManagers = [];
                        for (var i = 0; i < results.length; i++) {
                            empManagers.push(results[i].manager_id);
                        }
                        return empManagers;
                    }

                });
            runMenu();
        });
    }

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
    }

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

    function addDepartment() {
        inquirer
            .prompt({
                name: "addDepartment",
                type: "list",
                message: "Select what you would like to do.",
                choices: ["Add Department", "EXIT"]
            })
            .then(function (answer) {
                // based on their answer, either call the bid or the post functions
                if (answer.addDepartment === "Add Department") {
                    postDepartment();
                } else {
                    runMenu();
                    // connection.end();
                }
            });
    }

    function postDepartment() {
        inquirer.prompt([
            {
                name: "department_id",
                type: "input",
                message: "Name:"
            }

        ])
            .then(function (answer) {
                connection.query(
                    "INSERT INTO department SET ?",
                    {
                        name: answer.department_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your department was created successfully!");

                        runMenu();
                    }
                );
            });

    }

    function addRole() {
        inquirer
            .prompt({
                name: "addRole",
                type: "list",
                message: "Select what you would like to do.",
                choices: ["Add Role", "EXIT"]
            })
            .then(function (answer) {
                // based on their answer, either call the bid or the post functions
                if (answer.addRole === "Add Role") {
                    postRole();
                } else {
                    runMenu();
                    // connection.end();
                }
            });
    }

    function postRole() {
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Role name:"
            },
            {
                name: "salary",
                type: "input",
                message: "Salary: $"
            },
            {
                name: "department_id",
                type: "input",
                message: "Department ID:"
            }

        ])
            .then(function (answer) {
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department_id
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your role was created successfully!");

                        runMenu();
                    }
                );
            });

    }

    function removeEmployee() {
        connection.query("SELECT * FROM employee", function (err, results) {
            if (err) throw err;
            inquirer
                .prompt({
                    name: "removeEmp",
                    type: "rawlist",
                    message: "Who would you like to remove from the list?",
                    choices: function () {
                        var removeArray = [];
                        for (var i = 0; i < results.length; i++) {
                            removeArray.push(results[i].first_name + " " + results[i].last_name);
                        }
                        return removeArray;
                    },
                });

        })
        runMenu();
    };

    function updateEmployee() {
        connection.query("SELECT * FROM employee", function (err, results) {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        name: "empName",
                        type: "list",
                        choices: function () {
                            var choicesArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choicesArray.push(results[i].first_name + " " + results[i].last_name);
                            }
                            return choicesArray;
                        },
                        message: "Who's role would you like to update?"
                    }


                ]);
        }).then(function (answer) {
            connection.query("SELECT employee.rile_id FROM ?", { name: answer.employee_id }, function (err, res) {
                console.log("Role: " + res[1].id);
            })
        }).then(function (res) {
            connection.query(
                "INSERT INTO role",
                {
                    id: res.id
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your role was changed successfully!");

                    runMenu();
                }
            );
        });

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
}
