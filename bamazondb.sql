CREATE DATABASE bamazondb_products;
SELECT * FROM bamazondb_products;
SELECT * from products;
SELECT * FROM bamazondb_products;
SELECT COUNT(*), COUNT(*) FROM bamazondb_products WHERE Item_id = 10;
SELECT item_id, product_name, stock_quantity FROM bamazondb_products;
UPDATE products SET stock_quantity = stock_quantity = 100 WHERE item_id = 1;
SELECT * FROM products WHERE item_id = 4;
DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `item_id` int(11) NOT NULL,
  `product_name` varchar(150) DEFAULT NULL,
  `department_name` varchar(150) DEFAULT NULL,
  `price` decimal(9,2) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_id_UNIQUE` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


LOCK TABLES `products` WRITE;

INSERT INTO `products` VALUES 
(1,'Golden River Apples','Golden River Market',15.65,98),
(2,'Dog Soldier Action Figure','Namtengo Works',9.50,200),
(3,'Full Metal Alchemist - The Movie','Best Sells Mega Mark',20.00,89),
(4,'Monster Hunter Megaverse','CapuconI Eniq',75.99,29),
(5,'Intensive Repair Lotion','Pharmaceutical',24.50,66),
(6,'Techno-Laser Pistol','Nega-Arms Inc',550.99,878),
(7,'Nero-Link Power Armor','Nega-Arms Inc',1489.50,75),
(8,'Nero-Link Power Gloves','Nega-Arms Inc',875.00,42),
(9,'Ong Bak 18 - Wrath of the Giants','Best Sells Mega Mark',25.00,67),
(10,'Honey Red River Apples','Golden River MArket',17.89,52);

UNLOCK TABLES;