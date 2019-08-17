<?php
require_once('config.php');

function connect(){
  $dsn = DB.":dbname=".DBNAME.";host=".DBHOST;
  try {
    return new PDO($dsn, DBUSER, DBPWD);
  } catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
  }
}
