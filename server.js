const mysql = require("mysql");

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

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connected as id " + connection.threadId);
//   afterConnection();
});

// function afterConnection() {
//   // perform a select query and print the result in the console
//   connection.query("SELECT * FROM products", (err, res) => {
//     if (err) {
//       throw err;
//     }
//     console.log(res);
//     connection.end();
//   });
// }
