CREATE DATABASE  IF NOT EXISTS `parking_app` 
USE `parking_app`;

--

DROP TABLE IF EXISTS `cars`;

CREATE TABLE `cars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `parkingzone_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `parkingzone_id` (`parkingzone_id`),
  CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `cars_ibfk_2` FOREIGN KEY (`parkingzone_id`) REFERENCES `ParkingZone` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


