USE employee_DB;

Insert into departments(id,department)
values
(1,"Executive"),
(2,"Development"),
(3,"Operations");

Insert into roles(id, title, salary, department_id)
values
(1,"lead engineer",100000,2),
(2,"CIO",190000,1),
(3,"Junior engineer",65000,2),
(4,"Tech support",70000,3);

insert into employees (id, firstname, lastname, role_id, manager_id)
VALUES
    (1, "Mike", "Nguyen",2, null),
    (2, "Richard", "Swanson",1,1),
    (3, "Kevin", "Nguyen",3,2),
    (4, "Brian", "Diaz", 4,1);


SELECT employees.id AS id, employees.firstname, employees.lastname, manager.firstname AS manager,roles.title AS title,roles.salary AS salary, departments.department AS department,manager.firstname AS manager
FROM employees
JOIN roles ON employees.role_id = roles.id
LEFT JOIN employees AS manager ON employees.manager_id = manager.id
JOIN departments ON roles.department_id = departments.id
ORDER BY employees.id;