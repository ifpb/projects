DROP DATABASE IF EXISTS computer;
CREATE DATABASE computer;
USE computer;

DROP TABLE IF EXISTS `host`;
CREATE TABLE `memory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `json` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `hora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `horario` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);