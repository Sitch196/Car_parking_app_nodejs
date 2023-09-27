CREATE DATABASE  IF NOT EXISTS `parking_app` 
USE `parking_app`;

DROP TABLE IF EXISTS `ParkingZone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ParkingZone` (
  `id` int NOT NULL AUTO_INCREMENT,
  `zone_name` varchar(255) NOT NULL,
  `street_name` varchar(255) NOT NULL,
  `fee_per_hour` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `zone_name` (`zone_name`)
) 
