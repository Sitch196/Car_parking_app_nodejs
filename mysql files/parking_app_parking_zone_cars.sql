CREATE DATABASE  IF NOT EXISTS `parking_app` 
USE `parking_app`;

--

DROP TABLE IF EXISTS `parking_zone_cars`;

CREATE TABLE `parking_zone_cars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parking_zone_id` int NOT NULL,
  `car_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `parking_fee` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parking_zone_id` (`parking_zone_id`),
  KEY `car_id` (`car_id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `parking_zone_cars_ibfk_1` FOREIGN KEY (`parking_zone_id`) REFERENCES `ParkingZone` (`id`),
  CONSTRAINT `parking_zone_cars_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
)



