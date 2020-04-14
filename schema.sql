DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;

USE employee_DB;

CREATE TABLE employees (
id INT AUTO_INCREMENT,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(100) NULL,
role_id INT NULL,
manager_id INT NULL,
PRIMARY KEY (id)
);

CREATE TABLE roles(
id INT AUTO_INCREMENT,
title VARCHAR(30) NULL,
salary DECIMAL(10,2),
department_id INT NULL
PRIMARY KEY(id) 
);

CREATE TABLE departments(
id int AUTO_INCREMENT,
name VARCHAR (30) NULL,
PRIMARY KEY(id)

);

-- SELECT * FROM employees;