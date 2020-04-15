
DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;

USE employee_DB;

CREATE TABLE departments(
id int AUTO_INCREMENT,
department VARCHAR (30) NULL,
PRIMARY KEY(id)
);

CREATE TABLE roles(
id INT AUTO_INCREMENT,
title VARCHAR(30) NULL,
salary DECIMAL(10,2),
department_id INT NULL,
PRIMARY KEY(id),
FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
id INT AUTO_INCREMENT,
firstname VARCHAR(50),
lastname VARCHAR(100),
role_id INT,
manager_id INT,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES roles(id),
FOREIGN KEY (manager_id) REFERENCES employees(id)
);

