DROP DATABASE IF EXISTS `computer`;
CREATE DATABASE `computer`;
USE `computer`;

DROP TABLE IF EXISTS `horario`;
CREATE TABLE `horario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hora` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `hora_uniq` (`hora`)
);

DROP TABLE IF EXISTS `json`;
CREATE TABLE `json` (
  `id` int NOT NULL AUTO_INCREMENT,
  `json` varchar(100) NOT NULL,
  `horario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `horario_id` (`horario_id`),
  CONSTRAINT `horiario_id_fk` 
    FOREIGN KEY (`horario_id`) 
    REFERENCES `horario` (`id`)
    ON DELETE CASCADE
);


DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `USER` varchar(100) NOT NULL,
  `SENHA` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `USER_uniq` (`USER`)
);