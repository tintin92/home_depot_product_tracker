CREATE DATABASE IF NOT EXISTS homedepot_product_tracker;
USE homedepot_product_tracker;

CREATE TABLE price_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp DATETIME,
  product_name VARCHAR(255),
  price VARCHAR(50),
  product_url TEXT
);
