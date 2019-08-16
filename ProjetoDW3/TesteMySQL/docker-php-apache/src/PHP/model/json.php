<?php
namespace Modelo;

use Database\Database;
use \PDO;

require_once __DIR__."/../database/database.php";

class Json extends Database {

  public function create($name, $address_id) {
    $sql = "INSERT INTO json (json, horario_id) VALUES ('${name}', ${address_id})";
    try {
      $this->connection->exec($sql);
      return $this->connection->lastInsertId();
    } catch(PDOExecption $e) { 
      $this->connection->rollback(); 
      print "Error!: " . $e->getMessage(); 
      return null;
    } 
  }

  public function read($id) {
    $sql = "SELECT * FROM json WHERE id = ${id}";
    $pdoStm = $this->connection->query($sql);
    return $pdoStm ? $pdoStm->fetch(PDO::FETCH_ASSOC) : null;
  }

  public function readByName($name) {
    $sql = "SELECT * FROM json WHERE name='${name}'";
    $pdoStm = $this->connection->query($sql);
    return $pdoStm ? $pdoStm->fetch(PDO::FETCH_ASSOC) : null;
  }

  public function readAll() {
    $sql = "SELECT * FROM json";
    $pdoStm = $this->connection->query($sql);
    return $pdoStm ? $pdoStm->fetchAll(PDO::FETCH_ASSOC) : null;
  }

  public function readOrCreate($name, $address_id) {
    $result = $this->readByName($name);

    if ($result) {
      return $result;
    } else {
      return $this->create($name, $address_id);
    }
  }
  
  public function update($id, $name, $address_id) {
    $sql = "UPDATE json
            SET json='${name}', address_id='${address_id}'
            WHERE id=${id}";
    try {
      return $this->connection->exec($sql);
    } catch(PDOExecption $e) { 
      $this->connection->rollback(); 
      print "Error!: " . $e->getMessage(); 
    }
  }
  
  public function remove($id) {
    $sql = "DELETE FROM json WHERE id=${id}";
    try {
      return $this->connection->exec($sql);
    } catch(PDOExecption $e) { 
      $this->connection->rollback(); 
      print "Error!: " . $e->getMessage(); 
    }
  }

}

