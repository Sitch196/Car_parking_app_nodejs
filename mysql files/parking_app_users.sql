CREATE DATABASE  IF NOT EXISTS `parking_app` 
USE `parking_app`;
-


CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `balance` decimal(10,2) NOT NULL DEFAULT '100.00',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiration` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
)
