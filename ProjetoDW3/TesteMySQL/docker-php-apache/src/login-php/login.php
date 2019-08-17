<?php 

  session_start();

  $login = $_POST['usuario'];
  $senha = $_POST['senha'];

  require_once('read-host.php');

  //const DB = 'mysql';
  //const DBHOST = 'db';
  //const DBNAME = 'computer';
  //const DBUSER = 'root';
  //const DBPWD = 'abc123';

  //$con = mysql_connect("db", "root", "abc123") or die ("sem conexão com o servidor");
  //$select = mysql_select_db("mysql") or die ("Sem acesso ao DB, entre em contato com o Administrador");

  $select = readByNameAddress($login,$senha);

  //$result = mysql_query("SELECT * FROM `usuario` WHERE `USER` = '$login' AND `SENHA` = '$senha'");
  

  if($select != NULL )
  {

    unset($_SESSION['usuario']);
    unset($_SESSION['senha']);

    $_SESSION['auth'] = true;

    header('location: ../HTML/home.html');

  }
  else{

    $_SESSION['usuario'] = $login;
    $_SESSION['senha'] = $senha;
    header('location: index.php');

  }
    
?>