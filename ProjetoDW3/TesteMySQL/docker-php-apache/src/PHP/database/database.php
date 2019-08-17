<?php
namespace Database;

use \PDO;

require_once('config.php');

class Database {

  protected $connection;

  function __construct(){
    $dsn = DB.":dbname=".DBNAME.";host=".DBHOST;
    try {
      $this->connection = new PDO($dsn, DBUSER, DBPWD);
    } catch (PDOException $e) {
      echo 'Connection failed: ' . $e->getMessage();
    }
  }

}
