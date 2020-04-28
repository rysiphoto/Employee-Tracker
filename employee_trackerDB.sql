DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE employee
(
    id int
    auto_increment primary key,
first_name varchar
    (30),
last_name varchar
    (30),
role_id int,
constraint fk_category
foreign key
    (role_id)
references role
    (id),
manager_id int

) ENGINE = INNODB;

    CREATE TABLE role
    (
        id int
        auto_increment primary key,
title varchar
        (30),
salary decimal,
department_id int,
constraint fk_category
foreign key
        (department_id)
references department
        (id)
) ENGINE = INNODB;

        CREATE TABLE department
        (
            id int
            auto_increment primary key,
name varchar
            (30)
);


            SELECT *
            FROM employee;
            SELECT *
            FROM role;
            SELECT *
            FROM department;