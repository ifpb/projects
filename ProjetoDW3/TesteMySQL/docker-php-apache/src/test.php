<?php
use Modelo\Json;
use Modelo\Horario;

require_once('model/json.php');
require_once('model/horario.php');

$host = new Json();
$address = new Horario();

// Create  
$addId = $address->create('hora01:101');
var_dump($addId);  //=> string(1) "2"
$hostId = $host->create('testejson2', $addId);
var_dump($hostId); //=> string(1) "2"

// Read
var_dump($host->read($hostId));
//=>
// array(2) {
//   ["id"]=>string(1) "2"
//   ["name"]=>string(15) "www.ifpb.edu.b"
//   ["host_id"]=>string(1) "2"
// }

// Update
$host->update($hostId, 'jsonson', 2);
var_dump($host->read($hostId));
//=>
// array(2) {
//   ["id"]=>string(1) "2"
//   ["name"]=>string(15) "www.ifpb.edu.br"
//   ["host_id"]=>string(1) "2"
// }

// Delete
//var_dump($host->remove($hostId)); //=> int(1)
//var_dump($host->read($hostId));   //=> bool(false)
//var_dump($host->read($addId));    //=> bool(false)
?>
