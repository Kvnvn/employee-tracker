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
            "add Department",
            "add Role",
            "View All roles",
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
                // case "add department:
                //     addDepartment();
                //     break;
                // case "add role":
                //     addRole();
                //     break;
                case "View All roles":
                    viewAllRoles();
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
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What's the first name of the employee?"
        },
        {
          type: "input",
          name: "lastName",
          message: "What's the last name of the employee?"
        },
        {
          type: "input",
          name: "roleID",
          message: "What is the employee's role id?"
        },
        {
          type: "input",
          name: "managerID",
          message: "What is the manager's id"
        }
      ])
    .then (function(answer){
const query = "INSERT INTO employees SET ?"
connection.query(query,
    {firstname:answer.firstName,
     lastName:answer.lastName,
     role_id: answer.roleID,
     manager_id:answer.managerID}
    ,function(err,res)
{
    if (err)
    throw err;
})
employeeSearch()
    })
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

