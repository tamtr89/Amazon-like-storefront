DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;
USE bamazon_DB;

-- Products Table
CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTERGER(11),
    PRIMARY KEY (item_id)
);

-- Departments Table

-- ==============================================================================

-- Populate this database with around 10 different products. NORDSTROM STORE
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("UGG Amie-Classic Slim", "Boots", 129.90, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Waterproof Hiker Boots ", "Boots", 189.90, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("ML Leather backpack", "Handbags", 158.40, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("YSL Calfskin wallet", "Handbags", 1358.00, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Longchamp Hobo", "Handbags", 780.00, 9);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Fluffy Robe", "Sleepwear", 60.00, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Llama Mule Slipper", "Sleepwear", 30.00, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("44mm TedBaker watch", "Jewelry", 175.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("DoubleX Ring", "Jewelry", 450.00, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("BellaBot Charm", "Jewelry", 60.00, 2);
