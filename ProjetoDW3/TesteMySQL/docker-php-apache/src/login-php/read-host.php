<?php

require_once('database.php');
require_once('create-host.php');

$connection = connect();

/**
 *  Read by ID
 */
function read($id) {
  global $connection;
  $sql = "SELECT * FROM usuario WHERE id = ${id}";
  $pdoStm = $connection->query($sql);
  return $pdoStm ? $pdoStm->fetch(PDO::FETCH_ASSOC) : null;
}

/**
 * Read by Name and Address
 */
function readByNameAddress($name, $address) {
  global $connection;
  $sql = "SELECT * FROM usuario WHERE USER='${name}' AND SENHA='${address}'";
  $pdoStm = $connection->query($sql);
  return $pdoStm ? $pdoStm->fetch(PDO::FETCH_ASSOC) : null;
}

/**
 * Read All
 */
function readAll() {
  global $connection;
  $sql = "SELECT * FROM host";
  $pdoStm = $connection->query($sql);
  return $pdoStm ? $pdoStm->fetchAll(PDO::FETCH_ASSOC) : null;
}

/**
 * Read or Create
 */
function readOrCreate($name, $address) {
  global $connection;
  $result = readByNameAddress($name, $address);

  if ($result) {
    return $result;
  } else {
    return create($name, $address);
  }
}