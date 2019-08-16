<?php

require_once('./model/json.php');
require_once('./model/horario.php');

use Modelo\Horario;
use Modelo\Json;

$host = new Json();
$address = new Horario();



$memoinfo = shell_exec("free -mh | grep -v 'Swap\|total' | sed 's/Mem: // ; s/i//g' | tr '\n' ' '");
$data = shell_exec("date");

$memovalores = preg_split('/\s+/', $memoinfo);

$memoresult = json_encode([
    'total' => $memovalores[1],
    'used' => $memovalores[2],
    'free' => $memovalores[3],
    'shared' => $memovalores[4],
    'buffcache' => $memovalores[5],
    'available' => $memovalores[6]
]);

$file = fopen('../JSON/memory.json','w+') or die("File not found");
fwrite($file, $memoresult);
fclose($file);

// Create  
$addId = $address->create($data);

$hostId = $host->create($memoresult, $addId);

?>