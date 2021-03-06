const mysql = require("mysql");
var inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Password",
    database: "employee_DB",
});
connection.connect(function (err) {
    if (err) throw err;
    employeeSearch();
});
function employeeSearch() {
    inquirer.prompt({
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "add Employee",
            "add Role",
            "add Department",
            "update employee",
            "View All roles",
            "view Departments",
            "exit"
        ]
    })
        .then(function (answer) {
            switch (answer.options) {
                case "View All Employees":
                    viewEmployee();
                    break;
                case "View All Employees by Department":
                    viewEmployeeByDep();
                    break;
                case "add Employee":
                    addEmployee();
                    break;
                case "add Role":
                    addRole();
                    break;
                case "add Department":
                    addDepartment();
                    break;
                case "update employee":
                    updateEmployee();
                    break;
                case "View All roles":
                    viewAllRoles();
                    break;
                case "view Departments":
                    viewDepartments();
                    break;
                case "exit":
                    connection.end();
                    break;
            }
        })
}
function viewEmployee() {
    const query = "SELECT employees.id AS id, employees.firstname, employees.lastname, manager.firstname AS manager,roles.title AS title, roles.salary AS salary, departments.department AS department,manager.firstname AS manager FROM employees JOIN roles ON employees.role_id = roles.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id JOIN departments ON roles.department_id = departments.id ORDER BY employees.id"
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("id: " + res[i].id +
                "|| First name: " + res[i].firstname +
                "|| last name: " + res[i].lastname +
                "|| Role:" + res[i].title +
                "|| Department:" + res[i].department +
                "|| Salary:" + res[i].salary +
                "|| Manager:" + res[i].manager)
        }
        employeeSearch();
    });
}

function viewEmployeeByDep() {
    inquirer.prompt({
        type: "list",
        name: "departmentNames",
        message: "What Department would you like to view?",
        choices: [
            "Executive",
            "Development",
            "Operations"
        ]
    })

        .then(function (answer) {
            const query = "SELECT employees.id AS id, employees.firstname, employees.lastname, manager.firstname AS manager,roles.title AS title, roles.salary AS salary, departments.department AS department,manager.firstname AS manager FROM employees JOIN roles ON employees.role_id = roles.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id JOIN departments ON roles.department_id = departments.id WHERE ? ORDER BY employees.id"
            connection.query(query, { department: answer.departmentNames }, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("id: " + res[i].id +
                        "|| First name: " + res[i].firstname +
                        "|| last name: " + res[i].lastname +
                        "|| Role:" + res[i].title +
                        "|| Department:" + res[i].department +
                        "|| Salary:" + res[i].salary +
                        "|| Manager:" + res[i].manager)
                }
                employeeSearch();
            });

        });

}


function addEmployee() {
    connection.query("SELECT id, title FROM roles", (err, roles) => {
        if (err) {
            throw err;
        }
        const roleTitles = roles.map((row) => row.title);
        connection.query("SELECT id, firstname, lastname FROM employees", (err, employees) => {
            if (err) {
                throw err;
            }
            const employeeInfo = employees.map((row) => `${row.firstname} ${row.lastname}`);
            return inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the employee's first name?",
                        name: "newFirstName"
                    },
                    {
                        type: "input",
                        message: "What is your employee's last name?",
                        name: "newLastName"
                    },
                    {
                        type: "list",
                        message: "What is the employee's role?",
                        name: "newRole",
                        choices: roleTitles
                    },
                    {
                        type: "list",
                        message: "Who is the employee's manager?",
                        name: "newManager",
                        choices: employeeInfo
                    }
                ])
                .then((answer) => {
                    const managerChoice = employees.find(
                        (row) => `${row.firstname} ${row.lastname}` === answer.newManager
                    );
                    const roleChoice = roles.find((row) => row.title === answer.newRole)
                    connection.query(
                        "INSERT INTO employees SET ?",
                        {
                            firstname: answer.newFirstName,
                            lastname: answer.newLastName,
                            role_id: roleChoice.id,
                            manager_id: managerChoice.id
                        },
                        (err, res) => {
                            if (err) throw err;
                        })
                    employeeSearch();
                })
        });
    });
};

function addRole() {
    connection.query("SELECT id, department FROM departments", (err, departments) => {
        if (err) {
            throw err;
        }
        const depNames = departments.map((row) => row.department);
        return inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is the title of newly added role?",
                    name: "newTitle"
                },
                {
                    type: "input",
                    message: "What is salary expectancy when working?",
                    name: "newSalary"
                },
                {
                    type: "list",
                    message: "What department is this role being transferred to?",
                    name: "newDep",
                    choices: depNames
                },
            ])
            .then((answer) => {
                const roleChoice = departments.find(
                    (row) => row.department === answer.newDep
                );
                connection.query(
                    "INSERT INTO roles SET ?",
                    {
                        title: answer.newTitle,
                        salary: answer.newSalary,
                        department_id: roleChoice.id
                    },
                    (err, res) => {
                        if (err) throw err;
                    })
                employeeSearch();
            })
    });
};
function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What other department would you like to add into departments?"
        }).then((answer) => {
            connection.query(
                "INSERT INTO departments SET ?",
                { department: answer.department },
                (err, res) => {
                    if (err) throw err;
                })
            employeeSearch();
        });
};

function updateEmployee() {
    connection.query("SELECT id, title FROM roles", (err, roles) => {
        if (err) {
            throw err;
        }
        const rolesInfo = roles.map((row) => row.title);
        connection.query("SELECT id, firstname, lastname FROM employees", (err, employees) => {
            if (err) {
                throw err;
            }
            const employeeInfo = employees.map((row) => `${row.firstname} ${row.lastname}`);
            return inquirer
                .prompt(
                    [{
                        name: "updateEmployee",
                        type: "list",
                        message: "Which employee would you like to give an update change to?",
                        choices: employeeInfo
                    },
                    {
                        name: "updateRole",
                        type: "list",
                        message: "Which role do you want to set for the selected employee?",
                        choices: rolesInfo
                    }]).then((answer) => {
                        const employeeChoice = employees.find(
                            (row) => `${row.firstname} ${row.lastname}` === answer.updateEmployee
                        );
                        const roleChoice = roles.find(
                            (row) => row.title === answer.updateRole
                        );
                        connection.query(
                            "UPDATE employees SET ? WHERE ?",
                            [{
                                role_id: roleChoice.id
                            },
                            {
                                id: employeeChoice.id
                            }],
                            (err, res) => {
                                if (err) throw err;
                            })
                        employeeSearch();
                    }
                    );
        });
    });
}

function viewAllRoles() {
    const query = "SELECT title From roles"
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("roles: " + res[i].title)
        }
        employeeSearch();
    });
}

function viewDepartments() {
    connection.query("SELECT department FROM departments",
        (err, res) => {
            for (let i = 0; i < res.length; i++) {
                console.log(
                    res[i].department
                );
            }
            employeeSearch();
        });
};

